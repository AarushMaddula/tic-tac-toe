function createPlayer(marker) {

    let wins = 0;

    const updateWins = function() {
        wins++;
    }

    const getWins = function() {
        return wins;
    }

    const resetWins = function() {
        wins = 0;
    }

    const getMarker = function() {
        return marker;
    }

    return {getMarker,updateWins, getWins, resetWins}
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

    const reset = function() {
        gameBoard.forEach((row) => {
            row.forEach((square) => {
                square.setOccupant(" ");
            })
        })
    }

    const getSquare = function(row, col) {
        return gameBoard[row][col];
    }

    const setSquare = function(row, col, occupant) {
        gameBoard[row][col].setOccupant(occupant);
    }

    const isEmptySquare = function(row, col) {
        return row < gameBoard.length && col < gameBoard[0].length && gameBoard[row][col].getSquareMarker() === " ";
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
            if (isArraySame(rowArr)) returnValue = getSquare(rowIndex, 0).getOccupant();
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

            if (isArraySame(colArr)) returnValue = getSquare(0, col).getOccupant();
        }

        if (returnValue !== -1) {
            return returnValue;
        }

        //checks diagonals
        const seArr = [];

        for (i = 0; i < gameBoard.length; i++) {
            seArr.push(getSquare(i, i))
        }

        if (isArraySame(seArr)) return getSquare(0, 0).getOccupant();

        const neArr = [];

        for (i = 0; i < gameBoard.length; i++) {
            neArr.push(getSquare(gameBoard.length - 1 - i, i))
        }

        if (isArraySame(neArr)) return getSquare(gameBoard.length - 1, 0).getOccupant();
    
        if (gameBoard.every((row) => row.every((square) => square.getSquareMarker() !== " "))) return "tie";

        return "continue";
    } 

    const getGameBoard = function() {
        return gameBoard;
    }

    return {isEmptySquare, makeMove, checkForWinner, getGameBoard, reset}
})()

const GameController = (function() {

    const gameBoardContainer = document.querySelector(".game-board-container");

    for (i = 0; i < 9; i++) {
        const squareElement = document.createElement('div');
        squareElement.classList.add("game-board-tile");
        squareElement.setAttribute('data-index', i);
        
        squareElement.addEventListener('click', (event) => {
            GameController.placeMarker(squareElement.getAttribute("data-index"));
        })

        gameBoardContainer.appendChild(squareElement);
    }

    const resetGame = document.querySelector('.reset-button');

    resetGame.addEventListener('click', () => {
        GameBoard.reset();
        player1.resetWins();
        player2.resetWins();
        updateUserScores();
        displayGameBoard();
    })

    const player1 = createPlayer("X");
    const player2 = createPlayer("O");

    let currentPlayer = player1;

    const placeMarker = function (index) {

        const row = Math.floor(index / 3);
        const col = index % 3;
    
        if (!GameBoard.isEmptySquare(row, col)) return;

        GameBoard.makeMove(row, col, currentPlayer);

        displayGameBoard();

        const winner = GameBoard.checkForWinner();

        if (winner !== "continue") displayWinner(winner);

        currentPlayer = currentPlayer === player1 ? player2 : player1; 
    }

    const displayWinner = function(player) {
        const dialog = document.querySelector(".winner-dialog");
        const dialogMessage = document.querySelector(".dialog-message");

        if (Object.getPrototypeOf(player) === createPlayer) {
            player.updateWins();
        }

        let text;
        if (player === "tie") {
            text = `Tie!`
        } else {
            text = `${player.getMarker()} won!`
            player.updateWins();
        }

        updateUserScores();

        dialogMessage.textContent = text;

        const closeDialogButton = document.querySelector('.close-dialog-button');

        closeDialogButton.addEventListener('click', (e) => {
            GameBoard.reset();
            displayGameBoard();

            dialog.close();
        })

        dialog.showModal();
    }

    const updateUserScores = function() {
        const player1Element = document.querySelector('.player-1 > .profile-score');
        const player2Element = document.querySelector('.player-2 > .profile-score');

        player1Element.textContent = `${player1.getWins()}`
        player2Element.textContent = `${player2.getWins()}`
    }

    const displayGameBoard = function() {
        const gameBoard = GameBoard.getGameBoard();

        gameBoard.forEach((rowArr, rowIndex) => {
            rowArr.forEach((square, colIndex) => {
               const squareElement = document.querySelector(`.game-board-container > div[data-index="${rowIndex * 3 + colIndex}"]`);

                squareElement.textContent = square.getSquareMarker();
            })
        })
    }

    

    return {placeMarker, displayGameBoard, updateUserScores}
}) ()

