// @ts-check

const Emitter = require("./emitter");
const WebSocket = require("ws");
const Mastermind = require("./mastermind");

module.exports = class Player extends Emitter {

    /**
     * @param {WebSocket} socket
     */
    constructor(socket) {
        super();
        this.socket = socket;
        this.guessIndex = 0;
        this.nomoves = false;

        this.socket.on("message", (message) => {
            let data;
            try {
                data = JSON.parse(message.toString());
            } catch(ex) {
                console.error(`Non-JSON message received: ${message}`);
            }
            
            this.emit(data.type, data);
            this.emit(`${data.type}-${data.state}`, data);
        });

        this.socket.on("close", (ev) => {
            this.emit("disconnect");
        });

    }

    /**
     * @param {Mastermind} game
     */
    joinGame(game) {
        this.game = game;
    }

}
