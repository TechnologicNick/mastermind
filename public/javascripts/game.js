// @ts-check

window.addEventListener("DOMContentLoaded", () => {

    const board = new Board(document.querySelector(".game-container"));
    const rows = [{
        colors: [0, 1, 2, 3],
        correct: 2,
        misplaced: 1,
    }, ];

    const palette = new Palette(
        document.querySelector(".colorpicker"),
        colors => {
            rows[board.currentRow] = {
                colors,
                correct: 0,
                misplaced: 0
            };
            board.applyRows(rows);
        },
    );

    document.querySelector(".gamebtn.back").addEventListener("click", palette.removeColor.bind(palette));

    const socket = new WebSocket(location.origin.replace(/^http/, 'ws'));

    socket.addEventListener("open", (e) => {
        console.log("Connected to websocket", e.target);

        document.querySelector(".gamebtn.confirm").addEventListener("click", () => {
            if (palette.colors.length !== 4) {
                return;
            }

            socket.send(JSON.stringify({
                type: "game",
                state: "submit",
                colors: palette.colors,
            }));
            
            
            
        });
    });

    socket.addEventListener("message", (e) => {
        let message;
        try {
            message = JSON.parse(e.data);
        } catch (ex) {
            console.error(`Non-JSON message received: ${message}`);
            message = e.data;
        }
        console.log(message);

        if (message.type === "queue") {
            document.querySelector("#queueposition").innerHTML = message.position + 1;
        } else if (message.type === "game") {
            if (message.state === "start") {
                document.querySelector("#queue-modal").classList.add("display-none");
            } else if (message.state === "result") {
                rows[board.currentRow].correct = message.result.correct;
                rows[board.currentRow].misplaced = message.result.misplaced;
                board.applyRows(rows);

                if (board.nextRow()) {
                    palette.clear();
                }
            } else if (message.state === "end") {
                if (message.result === "nomoves") {
                    createAlert("<h1>No guesses left!</h1>Waiting for other players to finish.", false);
                    // @ts-ignore
                    document.querySelector(".gamebtn.back").disabled = true;
                    // @ts-ignore
                    document.querySelector(".gamebtn.confirm").disabled = true;
                } else if (message.result === "lost") {
                    createAlert("<h1>Another player won!</h1>\nBetter luck next time.", true);
                } else if (message.result === "won") {
                    createAlert("<h1>Winner\nWinner\nChicken\nDinner🐔</h1>", true);
                } else if (message.result === "draw") {
                    createAlert("<h1>The game ended in a draw!</h1>\nNobody guessed the code", true)
                } else if (message.result === "abort") {
                    createAlert("<h1>Not enough players left</h1>", true);
                }
            } 
        }
    });

})

/**
 * @param {string} text
 * @param {boolean} backbtn
 */
function createAlert(text, backbtn) {
    let alert = document.querySelector("#alert");
    let btn = `<div id="play" class="show"><a class="btn" href="/">Back to menu</a></div>`
    alert.innerHTML = text;
    alert.innerHTML += backbtn ? btn : "";
    alert.classList.remove("display-none");
}

function hideAlert() {
    let alert = document.querySelector("#alert");
    alert.classList.add("display-none");
}
