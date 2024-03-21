const Sequelize = require('sequelize')

/* Local setup
const sequelize = new Sequelize('sales_manager', 'postgres', 'oopassword', {
    dialect: 'postgres',
    host: '172.28.74.209',
    port: 5432
})
*/
var sequelize;
try {
    sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
        dialect: 'postgres',
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT, 
        dialectOptions: {
            ssl: {
              require: true, 
              rejectUnauthorized: false
            }
          }
    })
    console.log("Connection stablished successfully")
} catch (error) {
    console.log("Error while stablishing connection to database", error)
}



module.exports = sequelize;
