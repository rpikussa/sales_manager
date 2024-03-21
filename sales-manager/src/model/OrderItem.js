const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/database');
const Order = require('./Order');
const Product = require('./Product');

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
//OrderItem.belongsTo(Order);
//OrderItem.belongsTo(Product);
module.exports = OrderItem;