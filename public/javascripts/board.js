// @ts-check

/**
 * @param {HTMLElement} element
 */
function Board(element) {
    this.element = element;
    this.currentRow = 0;
}

Board.prototype.applyRows = function(/** @type {{ colors?: number[]; correct?: number; misplaced?: number; }[]} */ rows) {
    rows.forEach(({ colors = [], correct = 0, misplaced = 0 }, rowIndex) => {
        const rowElem = this.element.querySelector(".grid-container").children.item(7 - 1 - rowIndex);
        const resultrowElem = this.element.querySelector(".result-container").children.item(7 - 1 - rowIndex);

        for (let i = 0; i < 4; i++) {
            // @ts-ignore
            rowElem.children[i].style.backgroundColor = colors[i] !== undefined ? `var(--game-color-${colors[i]})` : "";
        }

        // @ts-ignore
        Array.from(resultrowElem.querySelectorAll(".resultpeg")).forEach((/** @type HTMLElement */ resultpeg, index) => {
            if (index < correct) {
                resultpeg.style.backgroundColor = "var(--game-color-correct)";
            } else if (index < correct + misplaced) {
                resultpeg.style.backgroundColor = "var(--game-color-misplaced)";
            } else {
                resultpeg.style.backgroundColor = "";
            }
        });
    });
}
