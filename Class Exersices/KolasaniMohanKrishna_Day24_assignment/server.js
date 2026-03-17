const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const uploadRoutes = require("./routes/uploadRoutes");
const chatSocket = require("./sockets/chatSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

/* Serve uploaded files */
app.use("/materials", express.static(path.join(__dirname, "materials")));

/* Serve chat page */
app.use(express.static(path.join(__dirname, "public")));

/* Routes */
app.use("/", uploadRoutes);

/* Socket connection */
chatSocket(io);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});