const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Instructor = sequelize.define("Instructor", {
  name: DataTypes.STRING,
  email: DataTypes.STRING
});

module.exports = Instructor;