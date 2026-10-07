/* ========================================
   AI TIC-TAC-TOE
   USING MINIMAX ALGORITHM
======================================== */


/*
    PLAYER = X
    COMPUTER = O
*/


// ========================================
// GAME BOARD
// ========================================

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


// ========================================
// GAME VARIABLES
// ========================================

let gameOver = false;

let playerScore = 0;

let aiScore = 0;

let drawScore = 0;


// ========================================
// HTML ELEMENTS
// ========================================

const cells = document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const playerScoreText =
    document.getElementById("playerScore");

const aiScoreText =
    document.getElementById("aiScore");

const drawScoreText =
    document.getElementById("drawScore");

const newGameButton =
    document.getElementById("newGame");


// ========================================
// WINNING COMBINATIONS
// ========================================

const winningCombinations = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


// ========================================
// PLAYER MOVE
// ========================================

cells.forEach(function (cell) {

    cell.addEventListener("click", function () {

        // Get cell position
        const index =
            Number(cell.getAttribute("data-index"));


        // Stop if cell is already occupied
        if (board[index] !== "") {
            return;
        }


        // Stop if game is already over
        if (gameOver) {
            return;
        }


        // Player places X
        board[index] = "X";

        cell.textContent = "❌";


        // Disable clicked cell
        cell.disabled = true;


        // Check game result
        if (checkGameResult()) {
            return;
        }


        // Show AI thinking message
        statusText.textContent =
            "🤖 AI is thinking...";


        // Disable all cells while AI is thinking
        disableBoard();


        /*
            Small delay makes the AI
            look like it is thinking.
        */

        setTimeout(function () {

            computerMove();

        }, 400);

    });

});


// ========================================
// COMPUTER MOVE
// ========================================

function computerMove() {

    // Stop if game is over
    if (gameOver) {
        return;
    }


    let bestScore = -Infinity;

    let bestMove = -1;


    /*
        Try every empty position.
    */

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            // Temporarily place O
            board[i] = "O";


            /*
                Call Minimax.

                false means next turn
                belongs to the minimizing player.
            */

            const score =
                minimax(board, false);


            // Remove temporary move
            board[i] = "";


            /*
                Choose the move
                with highest score.
            */

            if (score > bestScore) {

                bestScore = score;

                bestMove = i;

            }

        }

    }


    // Make the best move
    if (bestMove !== -1) {

        board[bestMove] = "O";

        cells[bestMove].textContent = "⭕";

        cells[bestMove].disabled = true;

    }


    // Check result
    if (checkGameResult()) {
        return;
    }


    // Enable board again
    enableBoard();


    // Player's turn
    statusText.textContent =
        "Your Turn ❌";

}


// ========================================
// MINIMAX ALGORITHM
// ========================================

function minimax(boardState, isMaximizing) {


    /*
        If AI wins,
        return positive score.
    */

    if (checkWinner(boardState, "O")) {
        return 10;
    }


    /*
        If player wins,
        return negative score.
    */

    if (checkWinner(boardState, "X")) {
        return -10;
    }


    /*
        If board is full,
        game is a draw.
    */

    if (isBoardFull(boardState)) {
        return 0;
    }


    // ====================================
    // AI / MAXIMIZING PLAYER
    // ====================================

    if (isMaximizing) {

        let bestScore = -Infinity;


        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                // Try AI move
                boardState[i] = "O";


                // Recursively calculate score
                const score =
                    minimax(
                        boardState,
                        false
                    );


                // Undo move
                boardState[i] = "";


                // Select highest score
                bestScore =
                    Math.max(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }


    // ====================================
    // PLAYER / MINIMIZING PLAYER
    // ====================================

    else {

        let bestScore = Infinity;


        for (let i = 0; i < 9; i++) {

            if (boardState[i] === "") {

                // Try player move
                boardState[i] = "X";


                // Recursively calculate score
                const score =
                    minimax(
                        boardState,
                        true
                    );


                // Undo move
                boardState[i] = "";


                // Select lowest score
                bestScore =
                    Math.min(
                        bestScore,
                        score
                    );

            }

        }


        return bestScore;

    }

}


// ========================================
// CHECK WINNER
// ========================================

function checkWinner(boardState, player) {


    for (
        let i = 0;
        i < winningCombinations.length;
        i++
    ) {

        const combination =
            winningCombinations[i];


        const a = combination[0];

        const b = combination[1];

        const c = combination[2];


        /*
            Check whether the same player
            occupies all three positions.
        */

        if (
            boardState[a] === player &&
            boardState[b] === player &&
            boardState[c] === player
        ) {

            return true;

        }

    }


    return false;

}


// ========================================
// CHECK WHETHER BOARD IS FULL
// ========================================

function isBoardFull(boardState) {

    return boardState.every(
        function (cell) {

            return cell !== "";

        }
    );

}


// ========================================
// CHECK GAME RESULT
// ========================================

function checkGameResult() {


    // ====================================
    // PLAYER WINS
    // ====================================

    if (checkWinner(board, "X")) {

        statusText.textContent =
            "🎉 You Win!";


        playerScore++;


        playerScoreText.textContent =
            playerScore;


        gameOver = true;


        disableBoard();


        return true;

    }


    // ====================================
    // AI WINS
    // ====================================

    if (checkWinner(board, "O")) {

        statusText.textContent =
            "🤖 AI Wins!";


        aiScore++;


        aiScoreText.textContent =
            aiScore;


        gameOver = true;


        disableBoard();


        return true;

    }


    // ====================================
    // DRAW
    // ====================================

    if (isBoardFull(board)) {

        statusText.textContent =
            "🤝 It's a Draw!";


        drawScore++;


        drawScoreText.textContent =
            drawScore;


        gameOver = true;


        disableBoard();


        return true;

    }


    // Game continues
    return false;

}


// ========================================
// DISABLE BOARD
// ========================================

function disableBoard() {

    cells.forEach(function (cell) {

        cell.disabled = true;

    });

}


// ========================================
// ENABLE BOARD
// ========================================

function enableBoard() {

    cells.forEach(function (cell, index) {

        /*
            Only enable empty cells.
        */

        if (board[index] === "") {

            cell.disabled = false;

        }

    });

}


// ========================================
// NEW GAME
// ========================================

newGameButton.addEventListener(
    "click",
    function () {


        // Reset board
        board = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
        ];


        // Reset game state
        gameOver = false;


        // Clear all cells
        cells.forEach(
            function (cell) {

                cell.textContent = "";

                cell.disabled = false;

            }
        );


        // Reset status
        statusText.textContent =
            "Your Turn ❌";

    }
);