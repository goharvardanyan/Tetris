let canvas;
let context;
let arrayHeight = 19;
let arrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let level = 1;
let speed = 1;
let timer;
let winOrLose = "Playing";
let coordinateArray = [...Array(arrayHeight)].map(el => {
     el = new Array(arrayWidth).fill(0);
     return el;
}); 
let tetronminos = [];
let curTetromino;
let tetrominoColors = ["red", "green", "blue", "yellow", "purple", "cyan", "orange"];
let curTetrominoColor;

let gameBArray = [...Array(arrayHeight)].map(el => {
    return el = new Array(12).fill(0);
});

let stoppedShapeArray = [...Array(arrayHeight)].map(el => {
    return el = new Array(12).fill(0);
});

let dir = {
    idle: 0,
    down: 1,
    left: 2,
    right: 3
}
let direction;

class Coordinate{
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

document.addEventListener("DOMContentLoaded", setupCanvas);

function createCoorArray() {
    let i = 0;
    let j = 0;
    for (let y = 9; y <= 333; y += 18) {
        for (let x = 9; x <= 207; x += 18) {
            coordinateArray[i][j] = new Coordinate(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

function setupCanvas() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = 712;
    canvas.height = 720;

    context.scale(2, 2);
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width,canvas.height);

    context.strokeStyle = 'black';
    context.strokeRect(7.5, 7.5, 217, 344);

    context.fillStyle = "black";
    context.font = "21px Arial";
    context.fillText("Score", 230, 130);//60

    context.strokeRect(230,140,120,18);//70

    context.fillText(score.toString(), 240, 157);//86

    context.fillText("Level", 230, 60);
    context.strokeRect(230,70,120,18);//140
    context.fillText(level.toString(),240, 86);//157

    context.fillText("Win / Lose",230, 221);
    context.fillText(winOrLose, 240, 261);
    context.strokeRect(230, 232, 120, 50);


    document.addEventListener("keydown", handleKeyPress);
    createTetrominos();
    createTetromino();
    createCoorArray();
    drawTetromino();
}

function createTetrominos() {
    //T
    tetronminos.push([[1,0],[0,1],[1,1],[2,1]]);
    //I
    tetronminos.push([[0,0],[1,0],[2,0],[3,0]]);
    //J
    tetronminos.push([[0,0],[0,1],[1,1],[2,1]]);
    //O
    tetronminos.push([[0,0],[1,0],[0,1],[1,1]]);
    //L
    tetronminos.push([[2,0],[0,1],[1,1],[2,1]]);
    //S
    tetronminos.push([[1,0],[2,0],[0,1],[1,1]]);
    //Z
    tetronminos.push([[0,0],[1,0],[1,1],[2,1]]);
}

function createTetromino() {
     
    let randomTetromino = Math.floor(Math.random() * tetronminos.length);
    curTetromino = tetronminos[randomTetromino];
    curTetrominoColor = tetrominoColors[randomTetromino];
    
}

function drawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        context.fillStyle = curTetrominoColor;
        context.fillRect(coorX, coorY, 16, 16);
    }
}

function deleteTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        let x = curTetromino[i][0] + startX;
        let y = curTetromino[i][1] + startY;
        gameBArray[x][y] = 0;
        let coorX  = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        context.fillStyle = "white";
        context.fillRect(coorX, coorY, 16.5, 16.5);
    }
}

function moveTetrDown() {
    direction = dir.down;
    if (!checkVerticalCollision()) {
        deleteTetromino();
        startY++;
        drawTetromino();
    }     
}

function handleKeyPress(key) {
    if(winOrLose != "Game Over") {
        if(key.keyCode === 37) {
            direction = dir.left;
            if(!hittingWall() && !checkHorizontalCollision()) {
                deleteTetromino();
                startX--;
                drawTetromino();
            }  
        } else if (key.keyCode === 39) {
            direction = dir.right;
            if (!hittingWall() && !checkHorizontalCollision()) {
                deleteTetromino();
                startX++;
                drawTetromino();
            }  
        } else if (key.keyCode === 40) {
            direction = dir.down;
            moveTetrDown();
        }
        else if (key.keyCode === 38) {
            direction = dir.idle;
            rotateTetromino();
        }
    } 
}

function updateSpeed(speed) {
    timer = window.setInterval(function() {
        if (winOrLose !== "Game Over" && winOrLose !== "You Win") {
            moveTetrDown();
        }
    }, 1000/speed);
}
updateSpeed(speed);

function hittingWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX;
        if(newX <= 0 && direction === dir.left) {
            return true;
        } else if (newX >= 11 && direction === dir.right) {
            return true;
        }
    } 
    return false;
}

function checkVerticalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === dir.down) {
            y++;
        }
            if (typeof stoppedShapeArray[x][y + 1] === "string") {
                deleteTetromino();
                startY++;
                drawTetromino();
                collision = true;
                break;
            } 
            if (y >= 19) {
                collision = true;
                break;
            } 
    }
    if (collision) {
        if (startY <= 2) {
            winOrLose = "Game Over";
            context.fillStyle = "white";
            context.fillRect(230, 232, 120, 50);
            context.fillStyle = "black";
            context.fillText(winOrLose, 232,261);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            checkForCompleteRaws();
            createTetromino();
            direction = dir.idle;
            startX = 4;
            startY = 0;
            drawTetromino();
        }
    }
    return collision;
}

function checkHorizontalCollision() {
    let tetrominoCopy = curTetromino;
    let collision = false;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        if (direction === dir.left) {
            x--;
        } else if (direction === dir.right) {
            x++;
        }
        let stoppedShapeVal = stoppedShapeArray[x][y];
        if (typeof stoppedShapeVal === "string") {
            collision = true;
            break;
        }
    }
    return collision;
}

function checkForCompleteRaws() {
    let rowToDelete = 0;
    let startOfDeletion = 0;
    for (let y = 0; y < arrayHeight; y++) {
        let completed = true;
        for (let x = 0; x < arrayWidth; x++) {
            let square = stoppedShapeArray[x][y];
            if (square === 0 || (typeof square === "undefined")){
                completed = false;
                break;
            }
        }
        if (completed) {
            if (startOfDeletion === 0){
                startOfDeletion = y;
                rowToDelete++;
            }
            for(let i = 0; i < arrayWidth; i++) {
                stoppedShapeArray[i][y] = 0;
                gameBArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                context.fillStyle = "white";
                context.fillRect(coorX, coorY, 16.5, 16.5);
            }
        }
        if (rowToDelete > 0) {
            debugger;
            score += 10;
            if(score === 100) {
                level++;
                speed++;
                clearInterval(timer);
                updateSpeed(speed);
            }else if (score === 200){
                speed++;
                level++;
                clearInterval(timer);
                updateSpeed(speed);
            } else if (score === 350) {
                level++;
                speed++;
                clearInterval(timer);
                updateSpeed(speed);
            } else if (score === 500) {
                level++;
                speed++;
                clearInterval(timer);
                updateSpeed(speed);
            } else if (score === 1000) {
                winOrLose = "You Win";
                context.fillStyle = "white";
                context.fillRect(230, 232, 120, 50);
                context.fillStyle = "black";
                context.fillText(winOrLose, 232,261);
            }
            
            context.fillStyle = "white";
            context.fillRect(230,140,120,18);
            context.fillRect(230, 70, 120, 18);
            context.fillStyle = "black";
            context.fillText(level.toString(),240, 86)
            context.fillText(score.toString(),240, 157);
            moveRowsDown(rowToDelete, startOfDeletion);
            rowToDelete = 0;
            startOfDeletion = 0;
        }
    }
    
}

function moveRowsDown(rowToDelete, startOfDeletion) {
  for (let i = startOfDeletion - 1; i >= 0; i--) {
     for (let x = 0; x < arrayWidth; x++) {
         let y2 = i + rowToDelete;
         let square = stoppedShapeArray[x][i];
         let nextSquare = stoppedShapeArray[x][y2];
         if (typeof square === "string") {
            nextSquare = square;
            gameBArray[x][y2] = 1;
            stoppedShapeArray[x][y2] = square;
            let coorX = coordinateArray[x][y2].x;
            let coorY = coordinateArray[x][y2].y;
            context.fillStyle = nextSquare;
            context.fillRect(coorX, coorY, 16.5, 16.5);

            square = 0;
            gameBArray[x][i] = 0;
            stoppedShapeArray[x][i] = 0;
            coorX = coordinateArray[x][i].x;
            coorY = coordinateArray[x][i].y;
            context.fillStyle = "white";
            context.fillRect(coorX, coorY, 16.5, 16.5);
         }
     }
  }
}

function rotateTetromino() {
    //debugger;
    let newRotation = new Array();
    let tetrominoCopy = curTetromino;
    let curTetrominoBU;
    for (let i = 0; i < tetrominoCopy.length; i++) {
        curTetrominoBU = [...curTetromino];
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = (getLastSquareX(curTetromino) - y);
        let newY = x;
        newRotation.push([newX,newY]);
    }
    deleteTetromino();
    let newLastX = getLastSquareX(newRotation);
    let newFirstX = getFirstSquareX(newRotation);
    if (startX < arrayWidth / 2) {
        if(startX + newFirstX < 0) {
            startX -= newFirstX;
        }
    }
    if (startX > arrayWidth / 2) {
        if (startX + newLastX > 11) {
            startX = 11 - newLastX;
        }
    }
    try {
        curTetromino = newRotation;
        if(startX < 0 ) {
            startX = 0;
        }
        drawTetromino();
    }
    catch(e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            deleteTetromino();
            drawTetromino();
        }
    }
}
function getLastSquareX(curTetromino) {
    let lastX = 0;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if(square[0] > lastX) {
           lastX = square[0];    
        }
        
    }
    return lastX;
}
function getFirstSquareX(curTetromino) {
    let firstX = 3;
    for (let i = 0; i < curTetromino.length; i++) {
        let square = curTetromino[i];
        if(square[0] < firstX) {
           firstX = square[0];    
        } 
    }
    return firstX;
}