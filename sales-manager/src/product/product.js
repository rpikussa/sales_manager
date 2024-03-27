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
        
        var { count, rows } = await Product.findAndCountAll()

    } else {
        var id = parseInt(req.params.id)
        var { count, rows  } = await Product.findAndCountAll({
            where: {
                product_id: id
            }
        })

    }

    const response = {
        data: rows,
        numberofRecords: count
    }

    res.status(200).json(response);
})

app.post("/product", async function (req, res) {

    let statusCode = 201
    let responseMessage = ""
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

        const result = await product.save()
        .then((result) => {
            console.log(result)
        })
        .catch((error)=>{
            console.log(error)
        })

    } catch (error) {
        res.status(400).json(`Failed to process your request body: ${error}`);
    }

    var compositionList = [];
    compositions.forEach( (element, index) => {

        console.log(index, element.ingredient_id, element.quantity, product.product_id)
        compositionList[index] = new ProductComposition({ingredient_id: element.ingredient_id, quantity: element.quantity, product_id: product.product_id}) 
    })
    console.log(compositionList)

    await ProductComposition.bulkCreate(compositionList)
    .then((success)=>{
        console.log(`Compositions added successfully`)
    }).catch((error)=>{
        console.log(error)
    })
    
    res.status(201).json({"body": "Data processed"});
    
    /*
    const responseData = await Product.create({
        name: name,
        description: description,
        is_available_quantity: is_available
    }).then((success) => {
        // nested insert to include also the relationship into database tables

        responseMessage = `Product ${name} has been created successfully!`
        console.log(responseMessage)
        return success
    }).catch((error) => {
        responseMessage = `Failed creating the product`
        console.log(responseMessage)
        statusCode = 500
        return (error)
    })
    
    const response = {
        statusCode: statusCode,
        message: responseMessage,
        body: responseData
    };

    res.status(statusCode).json(response);
    */
})

// Default 404 route for those routes that does not have any mapping here
app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);