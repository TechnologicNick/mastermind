// @ts-check

const { randomInt } = require("crypto");

module.exports = class Mastermind {

    /**
     * @param {any} players
     */
    constructor(players) {
        this.players = players;

        this.code = [];
        for (let i = 0; i < 4; i++) {
            this.code.push(randomInt(4));
        }
    }

    start() {
        for (const player of this.players) {
            player.socket.send(JSON.stringify({
                type: "game",
                state: "start",
            }));
        }
    }

}
