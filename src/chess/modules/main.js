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

    function showConfirmation(message, action) {
        confirmationMessage.textContent = message;
        confirmAction = action;
        confirmationModal.style.display = 'flex';
    }

    function hideConfirmation() {
        confirmationModal.style.display = 'none';
        confirmAction = null;
    }

    function saveState() {
        const gameState = Game.getState();
        const sessionState = { whiteTime, blackTime, gameMode, aiDifficulty, playerIsWhite, moveNumber, pgnMoves };
        localStorage.setItem('chessGameState', JSON.stringify(gameState));
        localStorage.setItem('chessSessionState', JSON.stringify(sessionState));
        localStorage.setItem('chessUserSettings', JSON.stringify(userSettings));
    }

    function loadState() {
        const savedGameState = localStorage.getItem('chessGameState');
        const savedSessionState = localStorage.getItem('chessSessionState');
        const savedUserSettings = localStorage.getItem('chessUserSettings');
        
        if (savedUserSettings) {
            userSettings = JSON.parse(savedUserSettings);
            UI.applyTheme(userSettings.theme);
            UI.setPieceSet(userSettings.pieceSet);
        }

        if (savedGameState && savedSessionState) {
            Game.setState(JSON.parse(savedGameState));
            const session = JSON.parse(savedSessionState);
            whiteTime = session.whiteTime;
            blackTime = session.blackTime;
            gameMode = session.gameMode;
            aiDifficulty = session.aiDifficulty;
            playerIsWhite = session.playerIsWhite;
            moveNumber = session.moveNumber;
            pgnMoves = session.pgnMoves;
            return true;
        }
        return false;
    }

    function makeAIMove() {
        aiThinkingIndicator.style.display = 'block';
        setTimeout(() => {
            const bestMove = AI.getBestMove(Game.getState(), aiDifficulty);
            aiThinkingIndicator.style.display = 'none';
            if (bestMove) {
                handleMove(bestMove.startRow, bestMove.startCol, bestMove.endRow, bestMove.endCol);
            }
        }, 50);
    }

    function handleMove(startRow, startCol, endRow, endCol) {
        const piece = Game.getState().board[startRow][startCol];
        const capturedPiece = Game.getState().board[endRow][endCol];
        const wasWhiteTurn = Game.getState().whiteTurn;

        UI.animateMove(startRow, startCol, endRow, endCol, () => {
            Game.movePiece(startRow, startCol, endRow, endCol);
            
            if (capturedPiece) UI.playSound('capture');
            else UI.playSound('move');

            const state = Game.getState();
            const isCheck = Game.isKingInCheck(state.whiteTurn);
            const isCheckmate = Game.isCheckmate(state.whiteTurn);
            const moveNotation = Game.toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece, isCheck, isCheckmate);
            
            if (wasWhiteTurn) {
                pgnMoves.push(`${moveNumber}. ${moveNotation}`);
            } else {
                pgnMoves[pgnMoves.length - 1] += ` ${moveNotation}`;
            }

            UI.updateMoveHistory(moveNumber, moveNotation, wasWhiteTurn);
            if (!wasWhiteTurn) {
                moveNumber++;
            }

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
        saveState();
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
                if (gameMode === 'sandbox') {
                    Game.movePiece(startRow, startCol, row, col);
                    UI.createBoard(Game.getState());
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
            if (gameMode === 'sandbox') {
                Game.movePiece(startRow, startCol, endRow, endCol);
                UI.createBoard(Game.getState());
            } else {
                handleMove(startRow, startCol, endRow, endCol);
            }
        }
        draggedPiece = null;
    }

    function updateGameStatus() {
        if (gameMode === 'sandbox') {
            UI.updateStatus('Sandbox Mode');
            return;
        }

        const state = Game.getState();
        let status = state.whiteTurn ? "White's turn" : "Black's turn";
        let isGameOver = false;

        if (Game.isCheckmate(state.whiteTurn)) {
            status = "Checkmate! " + (state.whiteTurn ? "Black" : "White") + " wins.";
            isGameOver = true;
            UI.playSound('game-end');
        } else if (Game.isStalemate(state.whiteTurn) || Game.isInsufficientMaterial() || Game.isThreefoldRepetition()) {
            status = "Draw.";
            isGameOver = true;
            UI.playSound('draw');
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
            UI.createBoard(Game.getState());
            UI.updateTimers(whiteTime, blackTime, Game.getState().whiteTurn);
            updateGameStatus();
            startTimer();
            checkAIMove();
        }
    }

    function generatePGN() {
        let pgn = `[Event "Casual Game"]\n[Site "Local"]\n[Date "${new Date().toISOString().split('T')[0]}"]\n[Round "-"]\n[White "Player 1"]\n[Black "Player 2"]\n[Result "*"]\n\n`;
        pgn += pgnMoves.join(' ') + ' *';
        return pgn;
    }

    function bindEventListeners() {
        chessboard.addEventListener('click', handleSquareClick);
        chessboard.addEventListener('dragstart', handleDragStart);
        chessboard.addEventListener('dragover', handleDragOver);
        chessboard.addEventListener('drop', handleDrop);
        
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
            UI.createBoard(Game.getState());
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
            UI.createBoard(Game.getState());
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
    } else {
        initializeGame(false);
    }
    bindEventListeners();
});