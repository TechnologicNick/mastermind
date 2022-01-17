// @ts-check

const { randomInt } = require("crypto");
const Player = require("./player");

module.exports = class Mastermind {

    /**
     * @param {Player[]} players
     */
    constructor(players) {
        this.players = players;
        this.startTime = Date.now();

        /** @type number[] */
        this.code = [];
        for (let i = 0; i < 4; i++) {
            this.code.push(randomInt(5));
        }
    }

    /**
     * @param {import("./stats")} stat
     */
    setStats(stat){
        this.stat = stat;
    }

    start() {
        for (const player of this.players) {
            player.on("game-submit", data => {
                this.onSubmit(player, data.colors)
            });

            player.on("disconnect", () => {
                this.removePlayer(player);
                if (this.players.length < 2) {
                    this.players.forEach(p => p.socket.send(JSON.stringify({
                        type: "game",
                        state: "end",
                        result: "abort",
                    })));
                }
            });

            player.socket.send(JSON.stringify({
                type: "game",
                state: "start",
            }));
        }
    }

    /**
     * @param {Player} player
     * @param {number[]} colors
     */
    onSubmit(player, colors) {
        if (player.guessIndex > 6) {
            return;
        }

        const { correct, misplaced } = this.countResults(colors);

        // Keep track of the amount of guesses the player has made
        player.guessIndex++;

        // Check if the player has won
        if (correct >= 4) {

            // Update stats
            this.stat.stats.wins++;
            this.stat.stats.guesses++;
            this.stat.stats.averageGuesses = Math.round(this.stat.stats.guesses * 10 / this.stat.stats.wins) / 10;
            
            let duration = Date.now() - this.startTime;
            console.log({ duration, stats: this.stat.stats });
            if (duration < (this.stat.stats.shortestTime ?? Number.MAX_SAFE_INTEGER)) {
                this.stat.stats.shortestTime = duration;
            }
            this.stat.saveStats();
            
            // Tell all players the game has ended
            this.players.forEach(p => p.socket.send(JSON.stringify({
                type: "game",
                state: "end",
                result: p === player ? "won" : "lost",
            })));

        } else if (player.guessIndex > 6) {
            // The player is out of moves
            player.nomoves = true;
            
            // Check if all players are out of moves
            if (this.players.every(el => el.nomoves)) {

                // The game has ended in a draw
                this.players.forEach(p => p.socket.send(JSON.stringify({
                    type: "game",
                    state: "end",
                    result: "draw",
                })));

            } else {

                // There are still players with moves left, tell the player they're out of moves
                player.socket.send(JSON.stringify({
                    type: "game",
                    state: "end",
                    result: "nomoves",
                }));

            }
        }

        // Send the results of the player's guess back to them
        player.socket.send(JSON.stringify({
            type: "game",
            state: "result",
            result: {
                correct,
                misplaced,
            },
        }));
    }

    /**
     * @param {number[]} colors
     */
    countResults(colors) {
        let correct = 0;
        let misplaced = 0;
        let tempcode = [...this.code];

        // Count the amount of correctly guessed colors
        for (let i = 0; i < 4; i++) {
            if (tempcode[i] === colors[i]) {
                correct++;
                tempcode[i] = -1;
                colors[i] = -2;
            }
        }

        // Count the amount of misplaced colors
        for (let i = 0; i < 4; i++) {
            let index = tempcode.indexOf(colors[i])
            if (index !== -1) {
                misplaced++;
                tempcode[index] = -1;
                colors[i] = -2;
            }
        }

        return { correct, misplaced };
    }

    /**
     * @param {Player} player
     */
    removePlayer(player){
        let index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

}
