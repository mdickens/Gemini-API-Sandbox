// main.js

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    let selectedPiece = null;
    let selectedSquare = null;
    let whiteTime = 600;
    let blackTime = 600;
    let timerInterval;

    function saveGame() {
        const gameState = Game.getState();
        const timerState = { whiteTime, blackTime };
        localStorage.setItem('chessGameState', JSON.stringify(gameState));
        localStorage.setItem('chessTimerState', JSON.stringify(timerState));
    }

    function loadGame() {
        const savedGameState = localStorage.getItem('chessGameState');
        const savedTimerState = localStorage.getItem('chessTimerState');
        if (savedGameState) {
            Game.setState(JSON.parse(savedGameState));
        }
        if (savedTimerState) {
            const { white, black } = JSON.parse(savedTimerState);
            whiteTime = white;
            blackTime = black;
        }
    }

    function handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (selectedPiece) {
            const startRow = parseInt(selectedSquare.dataset.row);
            const startCol = parseInt(selectedSquare.dataset.col);

            if (Game.isValidMove(startRow, startCol, row, col)) {
                const piece = Game.getState().board[startRow][startCol];
                const capturedPiece = Game.getState().board[row][col];
                
                UI.animateMove(startRow, startCol, row, col, () => {
                    Game.movePiece(startRow, startCol, row, col);
                    
                    if (capturedPiece) UI.playSound('capture');
                    else UI.playSound('move');

                    updateGameStatus();
                    UI.createBoard(Game.getState());
                    saveGame();
                });
            }
            UI.clearHighlights();
            selectedPiece = null;
            selectedSquare = null;

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if ((Game.getState().whiteTurn && Game.isWhite(piece)) || (!Game.getState().whiteTurn && !Game.isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    square.classList.add('selected');
                    UI.highlightValidMoves(row, col);
                }
            }
        }
    }

    function updateGameStatus() {
        const state = Game.getState();
        let status = state.whiteTurn ? "White's turn" : "Black's turn";
        let isGameOver = false;

        if (Game.isCheckmate(state.whiteTurn)) {
            status = "Checkmate! " + (state.whiteTurn ? "Black" : "White") + " wins.";
            isGameOver = true;
        } else if (Game.isStalemate(state.whiteTurn)) {
            status = "Stalemate! It's a draw.";
            isGameOver = true;
        } else if (Game.isInsufficientMaterial()) {
            status = "Draw by insufficient material.";
            isGameOver = true;
        } else if (Game.isThreefoldRepetition()) {
            status = "Draw by threefold repetition.";
            isGameOver = true;
        } else if (Game.isKingInCheck(state.whiteTurn)) {
            status = (state.whiteTurn ? "White" : "Black") + " is in check.";
            UI.playSound('check');
        }
        
        UI.updateStatus(status);
        document.getElementById('claim-draw-button').disabled = state.fiftyMoveRuleCounter < 100;

        if (isGameOver) {
            clearInterval(timerInterval);
            chessboard.removeEventListener('click', handleSquareClick);
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (Game.getState().whiteTurn) whiteTime--;
            else blackTime--;
            UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
            saveGame();
            if (whiteTime === 0 || blackTime === 0) {
                clearInterval(timerInterval);
                const winner = whiteTime === 0 ? "Black" : "White";
                UI.updateStatus(`Time's up! ${winner} wins.`);
                chessboard.removeEventListener('click', handleSquareClick);
            }
        }, 1000);
    }

    // Event Listeners
    chessboard.addEventListener('click', handleSquareClick);
    
    document.getElementById('new-game-button').addEventListener('click', () => {
        showConfirmation('Are you sure you want to start a new game?', () => {
            localStorage.clear();
            location.reload();
        });
    });

    document.getElementById('flip-board-button').addEventListener('click', () => {
        chessboard.classList.toggle('flipped');
    });

    // Init
    loadGame();
    UI.createBoard(Game.getState());
    UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
    updateGameStatus();
    startTimer();
});
