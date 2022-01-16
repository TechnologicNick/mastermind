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
            }
        }
    });

})
