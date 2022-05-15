// Follow along code from Game Code Bites
// https://www.youtube.com/watch?v=l93ROwlCM9M&ab_channel=GameCodeBites
// https://github.com/fahadhaidari/game-code-bites/tree/master/grid-based-system-with-character

console.log("script is linked");

//Using js class syntax
class GridSystem {
    //constructor method for class 
    constructor(matrix, playerX, playerY) {
        this.matrix = matrix;
        this.uiContext = this.#getContext(520, 680, "#000"); //space around game
        this.outlineContext = this.#getContext(0, 0, "#444"); //static grid of game
        this.topContext = this.#getContext(0, 0, "#111", true); //transparent canvas on top used to render the things that need to be rendered more frequently
        this.cellsize = 40;
        this.padding = 2;

        //player object
        this.player = { x: playerX, y: playerY, color: "orange" };
        this.matrix[playerY][playerX] = 2;

        document.addEventListener("keydown", this.#movePlayer);
    }

    //private method to tell us if the next move is vaild
    //need to check there is a solid cell in each direction
    #isValidMove(x, y) {
        if(this.matrix[this.player.y + y][this.player.x + x] === 0) {
            return true;
        }
        return false;
    }

    //private method to clear the value of the current cell and update the next
    //cell to have cell value of the player
    #updateMatrix(y, x, val) {
        this.matrix[y][x] = val;
    }

    //private method to move play based on arrow button press
    #movePlayer = ( { keyCode } ) => {
        if (keyCode === 37) { //left   
            if(this.#isValidMove(-1, 0)) {
                this.#updateMatrix(this.player.y, this.player.x, 0);
                this.#updateMatrix(this.player.y, this.player.x - 1, 2);
                this.player.x --;
                this.render();
            }
        } else if (keyCode === 39) { //right
            if(this.#isValidMove(1, 0)) {
                this.#updateMatrix(this.player.y, this.player.x, 0);
                this.#updateMatrix(this.player.y, this.player.x + 1, 2);
                this.player.x ++;
                this.render();
            }
        } else if (keyCode === 38) { //up
            if(this.#isValidMove(0, -1)) {
                this.#updateMatrix(this.player.y, this.player.x, 0);
                this.#updateMatrix(this.player.y - 1, this.player.x, 2);
                this.player.y --;
                this.render();
            }
        } else if (keyCode === 40) { //down
            if(this.#isValidMove(0, 1)) {
                this.#updateMatrix(this.player.y, this.player.x, 0);
                this.#updateMatrix(this.player.y + 1, this.player.x, 2);
                this.player.y ++;
                this.render();
            }
        }
    }

    //separate private method to get center of window
    #getCenter(w, h) {
        return {
            x: window.innerWidth / 2 - w / 2 + "px",
            y: window.innerHeight / 2 - h / 2 + "px"
        }
    }

    //helper method to create the multiple canvas'
    //# used to make method private
    #getContext(w, h, color = "#111", isTransparent = false) {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        this.width = this.canvas.width = w;
        this.height = this.canvas.height = h;
        this.canvas.style.position = "absolute";
        this.canvas.style.background = color;
        if (isTransparent) {
            this.canvas.style.backgroundColor = "transparent";
        }
        const center = this.#getCenter(w, h);
        this.canvas.style.marginLeft = center.x;
        this.canvas.style.marginTop = center.y;
        document.body.appendChild(this.canvas);

        return this.context; //adds the canvas
    }

    //render the grid using the rows and cols of the matrix
    render() {
        const w = (this.cellsize + this.padding) * this.matrix[0].length - (this.padding);
        const h = (this.cellsize + this.padding) * this.matrix.length - (this.padding);
        
        //recalculating the width and height of the Outline and top canvas'
        this.outlineContext.canvas.width = w;
        this.outlineContext.canvas.height = h;

        const center = this.#getCenter(w, h);
        this.outlineContext.canvas.style.marginLeft = center.x;
        this.outlineContext.canvas.style.marginTop = center.y;

        this.topContext.canvas.style.marginLeft = center.x;
        this.topContext.canvas.style.marginTop = center.y;

        for (let row = 0; row < this.matrix.length; row ++) {
            for(let col = 0; col < this.matrix[row].length; col ++) {
                //check what cell value we have so can render the relevant cell colour 
                const cellVal = this.matrix[row][col];
                let color = "#111";

                if (cellVal === 1) {
                    color = "#4488FF";
                } else if (cellVal === 2) {
                    color = this.player.color;
                }

                this.outlineContext.fillStyle = color;
                this.outlineContext.fillRect(col * (this.cellsize + this.padding), row * (this.cellsize + this.padding),
                this.cellsize, this.cellsize);
            }
        }

        this.uiContext.font = "20px Courier";
        this.uiContext.fillStyle = "white";
        this.uiContext.fillText("Grid Based System", 20, 30);

    }
}

//Array of arrays for gid layout to represent 2d array
const gridMatrix = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1]
];


const gridSystem = new GridSystem(gridMatrix, 1, 1); //1, 1 is row 1, col 1 for player
gridSystem.render();