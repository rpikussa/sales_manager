import { Ingredient } from '../model/model.js'
export const handler = async (event) => {

    if (event.httpMethod !== 'GET') {
        throw new Error(`This function only accepts GET method, you tried: ${event.httpMethod} method.`);
    }
    
    let statusCode = 201
    const allIngredients = await Ingredient.findAll()
    .then((success) => {
        return success
    }).catch((error) => {
        console.log(`Failed to process ypur request`, error)
        statusCode = 404
        return error
    })
    
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(allIngredients)
    };

    return response;
};
