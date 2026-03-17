const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Course = sequelize.define("Course", {
  title: DataTypes.STRING
});

module.exports = Course;