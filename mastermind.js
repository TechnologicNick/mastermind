// @ts-check

const {
    randomInt
} = require("crypto");
const Player = require("./player");

module.exports = class Mastermind {

    /**
     * @param {Player[]} players
     */
    constructor(players) {
        this.players = players;

        /** @type number[] */
        this.code = [];
        for (let i = 0; i < 4; i++) {
            this.code.push(randomInt(5));
        }
    }

    start() {
        for (const player of this.players) {
            player.on("game-submit", data => {
                if (player.guessIndex > 6) return;
                let correct = 0;
                let misplaced = 0;
                let tempcode = [...this.code];
                for (let i = 0; i < 4; i++) {
                    if (tempcode[i] === data.colors[i]) {
                        correct++;
                        tempcode[i] = -1;
                        data.colors[i] = -2;
                    }
                }
                for (let i = 0; i < 4; i++) {
                    let index = tempcode.indexOf(data.colors[i])
                    if (index !== -1) {
                        misplaced++;
                        tempcode[index] = -1;
                        data.colors[i] = -2;
                    }
                }
                player.guessIndex++;
                if (correct === 4) {
                    player.socket.send(JSON.stringify({
                        type: "game",
                        state: "end",
                        result: "won"
                    }));
                    this.players.filter(el => el !== player).forEach(p => p.socket.send(JSON.stringify({
                        type: "game",
                        state: "end",
                        result: "lost"
                    })))
                } else if (player.guessIndex > 6) {
                    player.nomoves = true;
                    if (this.players.map(el => el.nomoves).every(el => el)) {
                        this.players.forEach(p => p.socket.send(JSON.stringify({
                            type: "game",
                            state: "end",
                            result: "draw"
                        })))
                    } else {
                        player.socket.send(JSON.stringify({
                            type: "game",
                            state: "end",
                            result: "nomoves"
                        }));
                    }
                }

                player.socket.send(JSON.stringify({
                    type: "game",
                    state: "result",
                    result: {
                        correct: correct,
                        misplaced: misplaced
                    }
                }));
            });

            player.on("disconnect", () => {
                this.removePlayer(player);
                if(this.players.length < 2){
                    this.players.forEach(p => p.socket.send(JSON.stringify({
                        type: "game",
                        state: "end",
                        result: "abort"
                    })))
                }
            });

            player.socket.send(JSON.stringify({
                type: "game",
                state: "start",
            }));
        }
    }

    onSubmit(player, colors) {

    }

    removePlayer(player){
        let index = this.players.indexOf(player);
        if(index != -1)this.players.splice(index, 1);
    }

}
