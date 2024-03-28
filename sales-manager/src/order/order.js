const express = require("express");
const serverless = require("serverless-http");
const { Order, OrderItem } = require('../model/model.js');

const app = express()
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

// Get route by id with id being optional
app.get("/order/:id?", async function (req, res) {
    
    if(typeof req.params.id === undefined || req.params.id == "undefined" || req.params.id == "" || typeof req.params.id == "undefined")
    {
        var { count, rows } = await Order.findAndCountAll({include: OrderItem})

    } else {
        var id = parseInt(req.params.id)
        var { count, rows  } = await Product.findAndCountAll({
            where: {
                order_id: id
            },
            include: OrderItem
        })

    }

    const response = {
        data: rows,
        numberofRecords: count
    }

    res.status(200).json(response);
})

app.post("/order", async function (req, res) {

    if (req.method !== 'POST') {
        res.status(400).json(`This function only accepts POST method, you tried: ${req.method} method.`);
    }

    // TODO
    // Verify if the product itself is available
    // Verify if the product has enough ingredients to be available

    try {
        var { customer_name, total_amount, items } = req.body;
        var order = new Order({
            customer_name: customer_name,
            total_amount: total_amount
        })

        await order.save()
        .then((result) => {
            console.log(`Order created successfully: ${result}`)
        })
        .catch((error)=>{
            console.log(error)
            throw new Error(error)
        })

    } catch (error) {
        res.status(400).json(`Failed to process your request body: ${error}`);
    }

    for await (let element of items) {
        await OrderItem.create({product_id: element.product_id, amount: element.amount, quantity: element.quantity, order_id: order.order_id})
        .then((success)=>{
            return element
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const createdOrder = await Order.findOne({
        where: {
            order_id: order.order_id
        },
        include: OrderItem
    })
   
    console.log(createdOrder.name)
    const response = {
        statusCode: 201,
        message: `Sucessfully created order ${createdOrder.name}`,
        body: createdOrder
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