const express = require("express");
const http = require("http");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/", (req, res) => {
    res.sendFile("splash.html", { root: "./public" });
})

app.get("/play", (req, res) => {
    res.sendFile("game.html", { root: "./public" });
})