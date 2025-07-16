// main.js

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const gameSetupModal = document.getElementById('game-setup-modal');
    const mainLayout = document.getElementById('main-layout');
    const aiThinkingIndicator = document.getElementById('ai-thinking-indicator');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');

    let selectedPiece = null;
    let selectedSquare = null;
    let draggedPiece = null;
    let whiteTime = 600;
    let blackTime = 600;
    let timerInterval;
    let gameMode = 'pvp'; // pvp or pva
    let aiDifficulty = 'easy';
    let playerIsWhite = true;
    let confirmAction = null;

    function showConfirmation(message, action) {
        confirmationMessage.textContent = message;
        confirmAction = action;
        confirmationModal.style.display = 'block';
    }

    function hideConfirmation() {
        confirmationModal.style.display = 'none';
        confirmAction = null;
    }

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
            return true;
        }
        return false;
    }

    function makeAIMove() {
        aiThinkingIndicator.style.display = 'block';
        setTimeout(() => {
            const bestMove = AI.getBestMove(Game.getState(), aiDifficulty);
            if (bestMove) {
                const { startRow, startCol, endRow, endCol } = bestMove;
                const piece = Game.getState().board[startRow][startCol];
                const capturedPiece = Game.getState().board[endRow][endCol];

                UI.animateMove(startRow, startCol, endRow, endCol, () => {
                    Game.movePiece(startRow, startCol, endRow, endCol);
                    if (capturedPiece) UI.playSound('capture');
                    else UI.playSound('move');
                    updateGameStatus();
                    UI.createBoard(Game.getState());
                    saveGame();
                });
            }
            aiThinkingIndicator.style.display = 'none';
        }, 500); // Simulate thinking time
    }

    function handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square) return;

        const { whiteTurn } = Game.getState();
        if (gameMode === 'pva' && !playerIsWhite === whiteTurn) {
            return; // Not player's turn
        }

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

                    if (gameMode === 'pva' && !Game.getState().whiteTurn === !playerIsWhite) {
                        makeAIMove();
                    }
                });
            }
            UI.clearHighlights();
            selectedPiece = null;
            selectedSquare = null;

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if ((whiteTurn && Game.isWhite(piece)) || (!whiteTurn && !Game.isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    square.classList.add('selected');
                    UI.highlightValidMoves(row, col);
                }
            }
        }
    }

    function handleDragStart(event) {
        draggedPiece = event.target;
        event.dataTransfer.setData('text/plain', event.target.dataset.piece);
        setTimeout(() => {
            event.target.style.display = 'none';
        }, 0);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const targetSquare = event.target.closest('.square');
        if (!targetSquare) {
            draggedPiece.style.display = 'block';
            draggedPiece = null;
            return;
        };

        const startRow = parseInt(draggedPiece.parentElement.dataset.row);
        const startCol = parseInt(draggedPiece.parentElement.dataset.col);
        const endRow = parseInt(targetSquare.dataset.row);
        const endCol = parseInt(targetSquare.dataset.col);

        if (Game.isValidMove(startRow, startCol, endRow, endCol)) {
            const piece = Game.getState().board[startRow][startCol];
            const capturedPiece = Game.getState().board[endRow][endCol];
            Game.movePiece(startRow, startCol, endRow, endCol);
            if (capturedPiece) UI.playSound('capture');
            else UI.playSound('move');
            updateGameStatus();
            UI.createBoard(Game.getState());
            saveGame();
            if (gameMode === 'pva' && !Game.getState().whiteTurn === !playerIsWhite) {
                makeAIMove();
            }
        } else {
            draggedPiece.style.display = 'block';
        }
        draggedPiece = null;
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
            chessboard.removeEventListener('dragstart', handleDragStart);
            chessboard.removeEventListener('dragover', handleDragOver);
            chessboard.removeEventListener('drop', handleDrop);
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

    function initializeGame() {
        mainLayout.style.display = 'flex';
        gameSetupModal.style.display = 'none';
        
        const gameLoaded = loadGame();
        
        UI.createBoard(Game.getState());
        UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
        updateGameStatus();
        startTimer();
    }

    // Event Listeners
    chessboard.addEventListener('click', handleSquareClick);
    chessboard.addEventListener('dragstart', handleDragStart);
    chessboard.addEventListener('dragover', handleDragOver);
    chessboard.addEventListener('drop', handleDrop);
    
    document.querySelectorAll('.game-mode-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.game-mode-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            gameMode = button.dataset.mode;
            document.getElementById('ai-difficulty-selection').style.display = gameMode === 'pva' ? 'block' : 'none';
        });
    });

    document.getElementById('start-game-button').addEventListener('click', () => {
        localStorage.clear();
        aiDifficulty = document.getElementById('ai-difficulty').value;
        initializeGame();
    });

    document.getElementById('new-game-button').addEventListener('click', () => {
        showConfirmation('Are you sure you want to start a new game? This will erase your current game.', () => {
            localStorage.clear();
            location.reload();
        });
    });

    document.getElementById('flip-board-button').addEventListener('click', () => {
        chessboard.classList.toggle('flipped');
    });

    confirmYesButton.addEventListener('click', () => {
        if (confirmAction) {
            confirmAction();
        }
    });

    confirmNoButton.addEventListener('click', () => {
        hideConfirmation();
    });
});