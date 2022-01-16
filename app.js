const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const Mastermind = require("./mastermind");
const Player = require("./player");
const Queue = require("./queue");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));
const server = http.createServer(app)

app.get("/", (req, res) => {
    res.sendFile("splash.html", { root: "./public" });
})

app.get("/play", (req, res) => {
    res.sendFile("game.html", { root: "./public" });
})



const wss = new WebSocket.Server({ server });
const queue = new Queue();
queue.on("add", (/** @type Player */ player, position, players) => {
    queue.sendPosition(player);

    while (queue.players.length >= 2) {
        const game = new Mastermind(queue.popFirst(2));
        console.log("Created new game:", game);

        queue.players.forEach(p => queue.sendPosition(p));

        game.start();
    }
})

wss.on("connection", (socket) => {
    const player = new Player(socket);
    queue.addPlayer(player);
    
    socket.on("message", (message) => {
        try {
            message = JSON.parse(message);
            console.log("[LOG]", message);
        } catch(ex) {
            console.error(`Non-JSON message received: ${message}`);
        }
        
        
    });

    socket.on("close", () => {
        queue.removePlayer(player);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
