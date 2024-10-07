function createPlayer(marker) {

    const getMarker = function() {
        return marker;
    }

    return {getMarker}
}

function createSquare() {
    let occupant = " ";

    const setOccupant = function(o) {
        occupant = o;
    }

    const getOccupant = function() {
        return occupant;
    }

    const getSquareMarker = function() {
        return occupant === " " ? " " : occupant.getMarker();
    }

    return {setOccupant, getOccupant, getSquareMarker};
}
 
const GameBoard = (function() {
    const gameBoard = [];

    for (rowIndex = 0; rowIndex < 3; rowIndex++) {
        const row = [];

        for (colIndex = 0; colIndex < 3; colIndex++) {
            row.push(createSquare());
        }

        gameBoard.push(row);
    }

    const getSquare = function(row, col) {
        return gameBoard[row][col];
    }

    const setSquare = function(row, col, occupant) {
        gameBoard[row][col].setOccupant(occupant);
    }

    const isEmptySquare = function(row, col) {
        return row < gameBoard.length && col < gameBoard[0].length;
    }

    const makeMove = function(row, col, player) {
        setSquare(row, col, player);
    }

    const isArraySame = function(arr) {
        return arr.every((value, i, arr) => value.getSquareMarker() === arr[0].getSquareMarker() && value.getSquareMarker() !== " ");
    }

    const checkForWinner = function() {
        //checks rows  

        let returnValue = -1;

        gameBoard.forEach((rowArr, rowIndex) => {
            if (isArraySame(rowArr)) returnValue = getSquare(rowIndex, 0);
        })

        if (returnValue !== -1) {
            return returnValue;
        }

        //checks columns
        for (col = 0; col < gameBoard[0].length; col++) {
            const colArr = [];

            for (row = 0; row < gameBoard.length; row++) {
                colArr.push(getSquare(row, col));
            }

            if (isArraySame(colArr)) returnValue = getSquare(0, col);
        }

        if (returnValue !== -1) {
            return returnValue;
        }

        //checks diagonals
        const seArr = [];

        for (i = 0; i < gameBoard.length; i++) {
            seArr.push(getSquare(i, i))
        }

        if (isArraySame(seArr)) return getSquare(0, 0);

        const neArr = [];

        for (i = 0; i < gameBoard.length; i++) {
            neArr.push(getSquare(gameBoard.length - 1 - i, i))
        }

        if (isArraySame(neArr)) return getSquare(gameBoard.length - 1, 0);
    
        return null;
    } 

    const displayGameBoard = function() {
        let text = "";

        gameBoard.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
               text += ` ${col.getSquareMarker()} `
               if (colIndex !== gameBoard[0].length - 1) text += "|";
            })

            if (rowIndex !== gameBoard.length - 1) text += "\n - | - | - \n";
        })

        console.log(text)
    }

    return {isEmptySquare, makeMove, checkForWinner, displayGameBoard}
})()

const gameController = (function() {
    const player1 = createPlayer("X");
    const player2 = createPlayer("O");

    GameBoard.makeMove(0, 0, player1)
    GameBoard.makeMove(0, 1, player1)
    GameBoard.makeMove(0, 2, player1)


    GameBoard.displayGameBoard();
    const winner = GameBoard.checkForWinner();
    if (winner !== null) console.log(`${winner.getSquareMarker()} won!`)

}) ()