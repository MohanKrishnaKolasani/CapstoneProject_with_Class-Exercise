const EventEmitter = require("events");
const emitter = new EventEmitter();

emitter.on("userLoggedIn", (name) => {
    console.log(`User ${name} logged in.`);
});

emitter.on("userLoggedOut", (name) => {
    console.log(`User ${name} logged out.`);
});

emitter.on("sessionExpired", () => {
    console.log("Session expired.");
});

emitter.emit("userLoggedIn", "John");
emitter.emit("userLoggedOut", "John");

setTimeout(() => {
    emitter.emit("sessionExpired");
}, 3000);