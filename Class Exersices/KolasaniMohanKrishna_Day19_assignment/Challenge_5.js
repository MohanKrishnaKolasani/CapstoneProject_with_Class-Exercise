const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        fs.readFile("index.html", (err, data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });

    }

    else if (req.url === "/about") {

        res.writeHead(200, { "Content-Type": "text/plain" });
        res.write("About Page");
        res.end();

    }

    else {

        res.writeHead(404, { "Content-Type": "text/plain" });
        res.write("Page Not Found");
        res.end();

    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});