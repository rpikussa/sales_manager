const express = require("express");
const serverless = require("serverless-http");
const { Product, ProductComposition } = require('../model/model.js');

const app = express()
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

// Get route by id with id being optional
app.get("/product/:id?", async function (req, res) {
    
    if(typeof req.params.id === undefined || req.params.id == "undefined" || req.params.id == "" || typeof req.params.id == "undefined")
    {
        
        var { count, rows } = await Product.findAndCountAll({include: ProductComposition})

    } else {
        var id = parseInt(req.params.id)
        var { count, rows  } = await Product.findAndCountAll({
            where: {
                product_id: id
            },
            include: ProductComposition
        })

    }

    const response = {
        data: rows,
        numberofRecords: count
    }

    res.status(200).json(response);
})

app.post("/product", async function (req, res) {

    if (req.method !== 'POST') {
        res.status(400).json(`This function only accepts POST method, you tried: ${req.method} method.`);
    }

    try {
        var { name, description, is_available, compositions } = req.body;
        var product = new Product({
            name: name,
            description: description,
            is_available: is_available
        })

        await product.save()
        .then((result) => {
            console.log(result)
        })
        .catch((error)=>{
            console.log(error)
            throw new Error(error)
        })

    } catch (error) {
        res.status(400).json(`Failed to process your request body: ${error}`);
    }

    for await (let element of compositions) {
        await ProductComposition.create({ingredient_id: element.ingredient_id, quantity: element.quantity, product_id: product.product_id})
        .then((success)=>{
            return element
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const createdProduct = await Product.findOne({
        where: {
            product_id: product.product_id
        },
        include: ProductComposition
    })
   
    console.log(createdProduct.name)
    const response = {
        statusCode: 201,
        message: `Sucessfully created product ${createdProduct.name}`,
        body: createdProduct
    };

    res.status(201).json(response);

})

// Default 404 route for those routes that does not have any mapping here
app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);