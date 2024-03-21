const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const OrderItem = require('./OrderItem');

class Order extends Model {}
Order.init({
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
//Order.hasMany(OrderItem);
module.exports = Order;