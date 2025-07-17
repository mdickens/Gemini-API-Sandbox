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
    const gameOverModal = document.getElementById('game-over-modal');
    const gameOverMessage = document.getElementById('game-over-message');
    const newGameOverButton = document.getElementById('new-game-over-button');

    let selectedPiece = null;
    let selectedSquare = null;
    let draggedPiece = null;
    let whiteTime = 600;
    let blackTime = 600;
    let timerInterval;
    let gameMode = 'pvp';
    let aiDifficulty = 'easy';
    let playerIsWhite = true;
    let confirmAction = null;

    function showConfirmation(message, action) {
        confirmationMessage.textContent = message;
        confirmAction = action;
        confirmationModal.style.display = 'flex';
    }

    function hideConfirmation() {
        confirmationModal.style.display = 'none';
        confirmAction = null;
    }

    function saveGame() {
        const gameState = Game.getState();
        const sessionState = { whiteTime, blackTime, gameMode, aiDifficulty, playerIsWhite };
        localStorage.setItem('chessGameState', JSON.stringify(gameState));
        localStorage.setItem('chessSessionState', JSON.stringify(sessionState));
    }

    function loadGame() {
        const savedGameState = localStorage.getItem('chessGameState');
        const savedSessionState = localStorage.getItem('chessSessionState');
        if (savedGameState && savedSessionState) {
            Game.setState(JSON.parse(savedGameState));
            const session = JSON.parse(savedSessionState);
            whiteTime = session.whiteTime;
            blackTime = session.blackTime;
            gameMode = session.gameMode;
            aiDifficulty = session.aiDifficulty;
            playerIsWhite = session.playerIsWhite;
            return true;
        }
        return false;
    }

    async function makeAIMove() {
        aiThinkingIndicator.style.display = 'block';
        const bestMove = await AI.getBestMove(Game.getState(), aiDifficulty);
        aiThinkingIndicator.style.display = 'none';
        if (bestMove) {
            handleMove(bestMove.startRow, bestMove.startCol, bestMove.endRow, bestMove.endCol);
        }
    }

    function handleMove(startRow, startCol, endRow, endCol) {
        const piece = Game.getState().board[startRow][startCol];
        const capturedPiece = Game.getState().board[endRow][endCol];

        UI.animateMove(startRow, startCol, endRow, endCol, () => {
            Game.movePiece(startRow, startCol, endRow, endCol);
            
            if (capturedPiece) UI.playSound('capture');
            else UI.playSound('move');

            const state = Game.getState();
            const isCheck = Game.isKingInCheck(state.whiteTurn);
            const isCheckmate = Game.isCheckmate(state.whiteTurn);
            const moveNotation = Game.toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece, isCheck, isCheckmate);
            UI.updateMoveHistory(moveNotation);

            if (piece.toLowerCase() === 'p' && (endRow === 0 || endRow === 7)) {
                const isWhite = Game.isWhite(piece);
                UI.showPromotionChoices(endRow, endCol, isWhite, (newPiece) => {
                    Game.promotePawn(endRow, endCol, newPiece);
                    finishMove();
                });
            } else {
                finishMove();
            }
        });
    }
    
    function finishMove() {
        updateGameStatus();
        UI.createBoard(Game.getState());
        saveGame();
        checkAIMove();
    }

    function checkAIMove() {
        const state = Game.getState();
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            makeAIMove();
        }
    }

    function handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square) return;

        const state = Game.getState();
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            return;
        }

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (selectedPiece) {
            const startRow = parseInt(selectedSquare.dataset.row);
            const startCol = parseInt(selectedSquare.dataset.col);

            if (Game.isValidMove(startRow, startCol, row, col)) {
                handleMove(startRow, startCol, row, col);
            }
            UI.clearHighlights();
            selectedPiece = null;
            selectedSquare = null;

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if ((state.whiteTurn && Game.isWhite(piece)) || (!state.whiteTurn && !Game.isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    square.classList.add('selected');
                    UI.highlightValidMoves(row, col);
                }
            }
        }
    }

    function handleDragStart(event) {
        const state = Game.getState();
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            event.preventDefault();
            return;
        }
        draggedPiece = event.target;
        event.dataTransfer.setData('text/plain', event.target.dataset.piece);
        setTimeout(() => {
            event.target.classList.add('dragging');
        }, 0);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        if (!draggedPiece) return;

        const targetSquare = event.target.closest('.square');
        
        draggedPiece.classList.remove('dragging');

        if (!targetSquare) {
            draggedPiece = null;
            return;
        };

        const startRow = parseInt(draggedPiece.parentElement.dataset.row);
        const startCol = parseInt(draggedPiece.parentElement.dataset.col);
        const endRow = parseInt(targetSquare.dataset.row);
        const endCol = parseInt(targetSquare.dataset.col);

        if (Game.isValidMove(startRow, startCol, endRow, endCol)) {
            handleMove(startRow, startCol, endRow, endCol);
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
            gameOverMessage.textContent = status;
            gameOverModal.style.display = 'flex';
            chessboard.removeEventListener('click', handleSquareClick);
            chessboard.removeEventListener('dragstart', handleDragStart);
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
                updateGameStatus();
            }
        }, 1000);
    }

    function initializeGame(isNewGame) {
        if (isNewGame) {
            gameSetupModal.style.display = 'flex';
            mainLayout.style.display = 'none';
        } else {
            gameSetupModal.style.display = 'none';
            mainLayout.style.display = 'flex';
            if (!playerIsWhite) {
                chessboard.classList.add('flipped');
            }
            AI.init(); // Initialize the AI worker
            UI.createBoard(Game.getState());
            UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
            updateGameStatus();
            startTimer();
            checkAIMove();
        }
    }

    // --- Event Listeners ---
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

    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.color-button').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    document.getElementById('start-game-button').addEventListener('click', () => {
        localStorage.clear();
        aiDifficulty = document.getElementById('ai-difficulty').value;
        const selectedColor = document.querySelector('.color-button.selected').dataset.color;
        playerIsWhite = selectedColor === 'white';
        saveGame();
        initializeGame(false);
    });

    document.getElementById('new-game-button').addEventListener('click', () => {
        showConfirmation('Are you sure you want to start a new game? This will erase your current game.', () => {
            localStorage.clear();
            location.reload();
        });
    });
    
    newGameOverButton.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    document.getElementById('flip-board-button').addEventListener('click', () => {
        chessboard.classList.toggle('flipped');
    });

    confirmYesButton.addEventListener('click', () => {
        if (confirmAction) {
            confirmAction();
            hideConfirmation();
        }
    });

    confirmNoButton.addEventListener('click', () => {
        hideConfirmation();
    });

    // --- Initial Load ---
    if (!loadGame()) {
        initializeGame(true); // Show setup for new game
    } else {
        initializeGame(false); // Load existing game
    }
});
