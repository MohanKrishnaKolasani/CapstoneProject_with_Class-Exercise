const fs = require("fs").promises;
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your feedback: ", async (input) => {

    try {

        // write input to file
        await fs.writeFile("feedback.txt", input);
        console.log("Data written successfully.");

        console.log("Reading file...");

        // read file
        const data = await fs.readFile("feedback.txt", "utf8");
        console.log(data);

    } catch (err) {
        console.log(err);
    }

    rl.close();

});