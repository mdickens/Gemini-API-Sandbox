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
    }

    function reviewBoardState(moveIndex) {
        const boardHistory = Game.getState().boardHistory;
        if (moveIndex >= 0 && moveIndex < boardHistory.length) {
            const boardState = JSON.parse(boardHistory[moveIndex]);
            const state = Object.assign({}, Game.getState(), { board: boardState });
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
        if (gameMode === 'pva' && state.whiteTurn !== playerIsWhite) {
            return;
        }

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (selectedPiece) {
            const startRow = parseInt(selectedSquare.dataset.row);
            const startCol = parseInt(selectedSquare.dataset.col);

            if (Game.isValidMove(startRow, startCol, row, col)) {
                if (gameMode === 'sandbox') {
                    Game.movePiece(startRow, startCol, row, col);
                    updateBoardAndPreserveScroll();
                } else {
                    handleMove(startRow, startCol, row, col);
                }
            }
            UI.clearHighlights();
            selectedPiece = null;
            selectedSquare = null;

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if (gameMode === 'sandbox' || (state.whiteTurn && Game.isWhite(piece)) || (!state.whiteTurn && !Game.isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    square.classList.add('selected');
                    UI.highlightValidMoves(row, col);
                }
            }
        }
    }

    function startTimer() {
        if (gameMode === 'sandbox') {
            document.getElementById('timers').style.display = 'none';
            return;
        }
        timerInterval = setInterval(() => {
            if (Game.getState().whiteTurn) whiteTime--;
            else blackTime--;
            UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
            saveState();
        }, 1000);
    }

    function generatePGN() {
        let pgn = `[Event "Casual Game"]\n[Site "Local"]\n[Date "${new Date().toISOString().split('T')[0]}"]\n[Round "-"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n`;
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
                gameMode = button.dataset.mode;
                const aiOptions = document.getElementById('ai-difficulty-selection');
                if (gameMode === 'pva') {
                    aiOptions.style.display = 'block';
                } else {
                    aiOptions.style.display = 'none';
                }
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
            if (gameMode === 'pva') {
                aiDifficulty = document.getElementById('ai-difficulty').value;
                const selectedColor = document.querySelector('.color-button.selected').dataset.color;
                playerIsWhite = selectedColor === 'white';
            }
            saveState();
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

        settingsButton.addEventListener('click', () => {
            themeSelect.value = userSettings.theme;
            pieceSetSelect.value = userSettings.pieceSet;
            settingsModal.style.display = 'flex';
        });

        saveSettingsButton.addEventListener('click', () => {
            userSettings.theme = themeSelect.value;
            userSettings.pieceSet = pieceSetSelect.value;
            UI.applyTheme(userSettings.theme);
            UI.setPieceSet(userSettings.pieceSet);
            updateBoardAndPreserveScroll();
            saveState();
            settingsModal.style.display = 'none';
        });

        takebackButton.addEventListener('click', () => {
            const state = Game.getState();
            const movesToUndo = (gameMode === 'pva' && state.moveHistory.length > 1) ? 2 : 1;
            for (let i = 0; i < movesToUndo; i++) {
                if (state.moveHistory.length > 0) {
                    Game.takeback();
                    if (pgnMoves.length > 0) {
                        if (state.whiteTurn) {
                            moveNumber--;
                            const lastMove = pgnMoves[pgnMoves.length - 1];
                            pgnMoves[pgnMoves.length - 1] = lastMove.split(' ')[0];
                        } else {
                            pgnMoves.pop();
                        }
                    }
                }
            }
            updateBoardAndPreserveScroll();
            updateGameStatus();
            saveState();
        });

        exportPgnButton.addEventListener('click', () => {
            const pgn = generatePGN();
            const blob = new Blob([pgn], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'game.pgn';
            a.click();
            URL.revokeObjectURL(url);
        });

        copyPgnButton.addEventListener('click', () => {
            const pgn = generatePGN();
            navigator.clipboard.writeText(pgn).then(() => {
                alert('PGN copied to clipboard!');
            });
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

        window.addEventListener('beforeunload', (e) => {
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
