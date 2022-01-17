// @ts-check

const fs = require("fs");

module.exports = class Stats {

    constructor() {
        this.stats = this.readStats();
    }

    readStats() {
        try {
            let data = fs.readFileSync("stats.json", { encoding: "utf-8" });
            return JSON.parse(data);
        } catch (ex) {
            console.warn("Failed reading stats.json, resetting stats...");
            return {
                shortestTime: null,
                gamesPlayed: 0,
                averageGuesses: 0,
                wins: 0,
                guesses: 0,
            };
        }
    }

    saveStats() {
        fs.writeFileSync("stats.json", JSON.stringify(this.stats, null, "\t"));
    }

}
