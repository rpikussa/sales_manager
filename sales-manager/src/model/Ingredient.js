const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Product = require('./Product');

class Ingredient extends Model {}
Ingredient.init(
{
    ingredient_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    available_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    description: DataTypes.STRING
},{
    sequelize,
    modelName: 'ingredient'
}
)
Ingredient.belongsToMany(Product, { through: 'product_compositions' });
module.exports = Ingredient;