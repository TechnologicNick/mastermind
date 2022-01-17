// @ts-check

const Emitter = require("./emitter");
const Player = require("./player");

module.exports = class Queue extends Emitter {

    constructor() {
        super();
        this.players = [];
    }

    /**
     * @param {Player} player
     */
    addPlayer(player) {
        const position = this.players.push(player);
        this.emit("add", player, position, this.players);
    }

    /**
     * @param {Player} player
     */
    removePlayer(player) {
        this.players = this.players.filter(p => p !== player);
    }

    /**
     * @param {number} amount
     */
    popFirst(amount) {
        return this.players.splice(0, amount);
    }

    /**
     * @param {Player} player
     */
    sendPosition(player) {
        player.socket.send(JSON.stringify({
            type: "queue",
            position: this.players.indexOf(player),
            size: this.players.length,
        }));
    }

}
