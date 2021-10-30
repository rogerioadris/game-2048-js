document.addEventListener('DOMContentLoaded', () => {
    const gameDisplay = document.getElementById('game');
    const scoreDisplay = document.getElementById('score');

    const width = 4;
    const squares = [];
    const directions = {
        LEFT: "left",
        RIGHT: "right",
        UP: "up",
        DOWN: "down",
    }

    /**
     * Create game board
     */
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.innerHTML = 0;
            gameDisplay.appendChild(square);
            squares.push(square);
        }

        generate();
        generate();
    }

    /**
     * 
     */
    function setSquare(index, value) {
        const element = squares[index];
        element.className = `number-${value}`;
        element.innerHTML = value;
    }

    /**
     * Generate random number
     */
    function generate() {
        const randomNumber = Math.floor(Math.random() * squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            setSquare(randomNumber, 2);
        } else generate();
    }

    /**
     * 
     */
    function combine(row, direction) {
        const newRow = Array(width).fill(0).concat(row.filter(n => n)).slice(width * -1);

        for (let i = 0; i < (newRow.length - 1); i++) {
            if (newRow[i] > 0 && newRow[i] === newRow[i + 1]) {
                newRow[i] = newRow[i + 1] * 2;
                newRow[i + 1] = 0;
            }
        }

        const filterRow = newRow.filter(n => n);
        switch (direction) {
            case directions.LEFT:
            case directions.UP:
                return filterRow.concat(Array(width - filterRow.length).fill(0));

            default:
                return Array(width - filterRow.length).fill(0).concat(filterRow);
        }
    }

    /**
     *  
     */
    function movement(direction) {

        const grid = [];
        let score = 0;

        // Get grid values
        for (let x = 0; x < width * width; x++) {
            grid.push(parseInt(squares[x].innerHTML));
        }

        if (direction === directions.LEFT || direction === directions.RIGHT) {
            for (let x = 0; x < width * width; x = x + width) {
                let row = [];
                for (let y = 0; y < width; y++) {
                    row.push(grid[x + y]);
                }
                score = row.reduce((a, b) => a + b, score);
                combine(row, direction).forEach((v, i) => setSquare(i + x, v));
            }
        } else if (direction === directions.UP || direction === directions.DOWN) {
            for (let x = 0; x < width; x++) {
                let row = [];
                for (let y = 0; y < width * width; y = y + width) {
                    row.push(grid[y + x]);
                }
                score = row.reduce((a, b) => a + b, score);
                combine(row, direction).forEach((v, i) => setSquare((i * width) + x, v));
            }
        }
        generate();
        scoreDisplay.innerHTML = score + 2;
    }

    // Start game
    createBoard();

    // Keyboard events
    document.addEventListener('keyup', e => {
        if (e.key === 'ArrowRight') {
            movement(directions.RIGHT);
        } else if (e.key === 'ArrowLeft') {
            movement(directions.LEFT);
        } else if (e.key === 'ArrowUp') {
            movement(directions.UP);
        } else if (e.key === 'ArrowDown') {
            movement(directions.DOWN);
        }
    });
});