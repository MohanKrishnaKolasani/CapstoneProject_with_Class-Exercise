function chatSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected");
        socket.on("chat message", (msg) => {
            io.emit("chat message", msg);
        });
        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
}
module.exports = chatSocket;