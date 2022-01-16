// @ts-check

class Palette {

    /**
     * @param {HTMLElement} element
     * @param {(callback: number[]) => void} [onChange]
     */
    constructor(element, onChange) {
        this.element = element;
        this.onChange = onChange;
        this.colors = [];

        // @ts-ignore
        Array.from(this.element.children).forEach((/** @type HTMLElement */ peg, index) => {
            peg.addEventListener("click", (e) => {
                this.addColor(index);
                e.preventDefault();
            });
        });
    }

    /**
     * @param {number} color
     */
    addColor(color) {
        if (this.colors.length < 4) {
            this.colors.push(color);
            this.onChange?.(this.colors);
        }
    }

    removeColor() {
        this.colors.pop() !== undefined && this.onChange?.(this.colors);
    }

}
