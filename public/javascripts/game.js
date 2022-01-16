/// @ts-check

window.addEventListener("DOMContentLoaded", () => {

    const board = new Board(document.querySelector(".game-container"));
    const rows = [
        {
            colors: [0, 1, 2, 3],
            correct: 2,
            misplaced: 1,
        },
    ];

    const palette = new Palette(
        document.querySelector(".colorpicker"),
        colors => {
            rows[board.currentRow] = { colors, correct: 0, misplaced: 0 };
            board.applyRows(rows);
        },
    );

    document.querySelector(".gamebtn.back").addEventListener("click", palette.removeColor.bind(palette));
})
