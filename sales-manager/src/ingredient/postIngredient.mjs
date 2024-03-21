import sequelize from '../database/database.js';
import { Ingredient } from '../model/model.js'
export const handler = async (event) => {

    if (event.httpMethod !== 'POST') {
        throw new Error(`This function only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    
    const body = JSON.parse(event.body);
    const { name, available_quantity, description } = body;
    let statusCode = 201
    
    console.log("Ingredient object ", Ingredient)
    const newIngredient = await Ingredient.create({
        name: name,
        available_quantity: available_quantity,
        description: description
    }).then((success) => {
        console.log(`Ingredient ${name} has been created successfully!`)
        return success
    }).catch((error) => {
        console.log(`Failed creating an ingredient`, error)
        statusCode = 500
        return error
    })
    
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(newIngredient)
    };

    return response;
};
