const express = require("express");
const serverless = require("serverless-http");
const { Ingredient } = require('../model/model.js');

const app = express()
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json());

// Get route by id with id being optional
app.get("/ingredient/:id?", async function (req, res) {
    
    if(typeof req.params.id === undefined)
    {
        var { count, rows } = await Ingredient.findAndCountAll()

    } else {
        var id = parseInt(req.params.id)
        var { count, rows  } = await Ingredient.findAndCountAll({
            where: {
                ingredient_id: id
            }
        })

    }

    const response = {
        data: rows,
        numberofRecords: count
    }

    res.status(200).json(response);
})

app.post("/ingredient", async function (req, res) {

    let statusCode = 201
    let responseMessage = ""
    if (req.method !== 'POST') {
        res.status(400).json(`This function only accepts POST method, you tried: ${req.method} method.`);
    }
       
    try {
        var { name, available_quantity, description } = req.body;
    } catch (error) {
        res.status(400).json(`Failed to process your request body: ${error}`);
    }
    
    const responseData = await Ingredient.create({
        name: name,
        available_quantity: available_quantity,
        description: description
    }).then((success) => {
        responseMessage = `Ingredient ${name} has been created successfully!`
        console.log(responseMessage)
        return success
    }).catch((error) => {
        responseMessage = `Failed creating the ingredient`
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
})

// Default 404 route for those routes that does not have any mapping here
app.use((req, res, next) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

module.exports.handler = serverless(app);