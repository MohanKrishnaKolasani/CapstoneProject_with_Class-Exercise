console.log("Node Version:", process.version);
console.log("File Name:", __filename);
console.log("Directory Name:", __dirname);

const interval = setInterval(() => {
  console.log("Welcome to Node.js!");
}, 3000);

setTimeout(() => {
  clearInterval(interval);
  console.log("Timer stopped after 10 seconds.");
}, 10000);