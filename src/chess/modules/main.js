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
    const settingsModal = document.getElementById('settings-modal');
    const settingsButton = document.getElementById('settings-button');
    const saveSettingsButton = document.getElementById('save-settings-button');
    const themeSelect = document.getElementById('theme-select');
    const pieceSetSelect = document.getElementById('piece-set-select');
    const exportPgnButton = document.getElementById('export-pgn-button');
    const copyPgnButton = document.getElementById('copy-pgn-button');
    const takebackButton = document.getElementById('takeback-button');

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
    let moveNumber = 1;
    let pgnMoves = [];
    let userSettings = {
        theme: 'classic',
        pieceSet: 'unicode'
    };
    let isReviewing = false;
    let reviewMoveIndex = -1;

    function showConfirmation(message, action) {
        confirmationMessage.textContent = message;
        confirmAction = action;
        confirmationModal.style.display = 'flex';
...
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            makeAIMove();
        }
    }

    function reviewBoardState(moveIndex) {
        const boardHistory = Game.getState().boardHistory;
        if (moveIndex >= 0 && moveIndex < boardHistory.length) {
            const boardState = JSON.parse(boardHistory[moveIndex]);
            const state = { ...Game.getState(), board: boardState };
            UI.createBoard(state);
            reviewMoveIndex = moveIndex;
            isReviewing = true;
        }
    }

    function handleSquareClick(event) {
        if (isReviewing) return;
        const square = event.target.closest('.square');
        if (!square) return;

        const state = Game.getState();
...
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            event.preventDefault();
            return;
        }
        if (isReviewing) {
            event.preventDefault();
            return;
        }
        draggedPiece = event.target;
        event.dataTransfer.setData('text/plain', event.target.dataset.piece);
        setTimeout(() => {
            event.target.classList.add('dragging');
...
        if (isGameOver) {
            clearInterval(timerInterval);
            gameOverMessage.textContent = status;
            gameOverModal.style.display = 'flex';
            chessboard.removeEventListener('click', handleSquareClick);
            chessboard.removeEventListener('dragstart', handleDragStart);
        }
    }

    function startTimer() {
...
        if (isNewGame) {
            gameSetupModal.style.display = 'flex';
            mainLayout.style.display = 'none';
        } else {
            gameSetupModal.style.display = 'none';
            mainLayout.style.display = 'flex';
            bindEventListeners(); // Bind listeners only when the game board is visible
            if (!playerIsWhite) {
                chessboard.classList.add('flipped');
            }
            updateBoardAndPreserveScroll();
            UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
            updateGameStatus();
            startTimer();
            checkAIMove();
        }
    }

    function generatePGN() {
...
        pgn += pgnMoves.join(' ') + ' *';
        return pgn;
    }

    function bindEventListeners() {
        UI.bindEventListeners(handleSquareClick, handleDragStart, handleDrop);
        
        document.getElementById('move-history').addEventListener('click', (event) => {
            const moveElement = event.target.closest('[data-move-index]');
            if (moveElement) {
                const moveIndex = parseInt(moveElement.dataset.moveIndex);
                reviewBoardState(moveIndex);
            }
        });

        document.getElementById('prev-move-button').addEventListener('click', () => {
            if (reviewMoveIndex > 0) {
                reviewBoardState(reviewMoveIndex - 1);
            }
        });

        document.getElementById('next-move-button').addEventListener('click', () => {
            const boardHistory = Game.getState().boardHistory;
            if (reviewMoveIndex < boardHistory.length - 1) {
                reviewBoardState(reviewMoveIndex + 1);
            } else if (isReviewing) {
                isReviewing = false;
                reviewMoveIndex = -1;
                updateBoardAndPreserveScroll();
            }
        });

        document.querySelectorAll('.game-mode-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.game-mode-button').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
...
        if (Game.getState().moveHistory.length > 0) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // --- Initial Load ---
    if (!loadState()) {
        initializeGame(true);
        bindEventListeners(); // Bind listeners for the setup modal
    } else {
        initializeGame(false);
    }
});
