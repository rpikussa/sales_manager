
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database.js')

class Order extends Model {}
Order.init(
{
    order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
    }
    
}, {
    sequelize,
    modelName: 'order'
})

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
},{
    sequelize, 
    modelName: 'product'
})

class OrderItem extends Model {}
OrderItem.init(
{
    order_item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comment: DataTypes.STRING
    },{
        sequelize,
        modelName: 'order_item'
})
OrderItem.belongsTo(Order);
Order.hasMany(OrderItem);
Product.hasMany(OrderItem);    

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
})
Ingredient.belongsToMany(Product, { through: 'product_compositions' });
Product.belongsToMany(Ingredient, { through: 'product_compositions' });


sequelize.sync().then((result) => {
    console.log('Success: creating database')
})
.catch((err)=> {
    console.log(`Error: `, err)
});

/*
const Product = require('./Product.js')
const newProduct = await Product.create({
    name: 'Tomate',
    is_available: true,
    description: 'Tomate fresquinho'
}).then ((result) => {
    return result
}).catch((err) => {
    console.log(`Error: `, err)
})
console.log(newProduct)
*/

module.exports = { Product, Order, OrderItem, Ingredient };
