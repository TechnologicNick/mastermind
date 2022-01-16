// @ts-check

const WebSocket = require("ws");
const Mastermind = require("./mastermind");

module.exports = class Player {

    /**
     * @param {WebSocket} socket
     */
    constructor(socket) {
        this.socket = socket;
    }

    /**
     * @param {Mastermind} game
     */
    joinGame(game) {
        this.game = game;
    }

}
