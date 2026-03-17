const chalk = require("chalk");
const figlet = require("figlet");

figlet("Welcome to Node.js", function (err, data) {
  if (err) {
    console.log("Something went wrong");
    return;
  }
  console.log(chalk.green(data));
});