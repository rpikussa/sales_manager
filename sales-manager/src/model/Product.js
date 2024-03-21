const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database')
const OrderItem = require('./OrderItem');

class Product extends Model {}
Product.init(
    {
    product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: DataTypes.STRING,
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
    }, 
    {
        sequelize, 
        modelName: 'product'
    })
//Product.belongsToMany(Ingredient, { through: 'product_compositions' });
//Product.hasMany(OrderItem);
module.exports = Product;