const Sequelize = require("sequelize");
const sequelize = require("../db_instance");

const sale = sequelize.define(
    "sale",
    {      
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "-"
      },
      price: {
        type: Sequelize.NUMBER
        // allowNull defaults to true
      },
      amount: {
        type: Sequelize.NUMBER
        // allowNull defaults to true
      }
    },
    {
      // options
    }
  );


(async () => {
  await sale.sync({ force: false });    
})();

  
module.exports = sale;
