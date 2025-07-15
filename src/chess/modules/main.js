// main.js

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const gameSetupModal = document.getElementById('game-setup-modal');
    const mainLayout = document.getElementById('main-layout');
    const aiThinkingIndicator = document.getElementById('ai-thinking-indicator');

    let selectedPiece = null;
    let selectedSquare = null;
    let whiteTime = 600;
    let blackTime = 600;
    let timerInterval;
    let gameMode = 'pvp'; // pvp or pva
    let aiDifficulty = 'easy';
    let playerIsWhite = true;

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
...
        } else if (Game.isKingInCheck(state.whiteTurn)) {
            status = (state.whiteTurn ? "White" : "Black") + " is in check.";
            UI.playSound('check');
        }
