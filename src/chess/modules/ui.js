// ui.js

let isUpdatingUI = false;

const UI = (() => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');
    const whiteTimerDisplay = document.getElementById('white-timer');
    const blackTimerDisplay = document.getElementById('black-timer');
    const moveHistoryPanel = document.getElementById('move-history');
    const whiteCapturedPanel = document.getElementById('white-captured');
    const blackCapturedPanel = document.getElementById('black-captured');
    const promotionOverlay = document.getElementById('promotion-overlay');
    const promotionChoices = document.getElementById('promotion-choices');
    const moveSound = document.getElementById('move-sound');
    const captureSound = document.getElementById('capture-sound');
    const checkSound = document.getElementById('check-sound');

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateTimers(whiteTime, blackTime, isWhiteTurn) {
        whiteTimerDisplay.textContent = formatTime(whiteTime);
        blackTimerDisplay.textContent = formatTime(blackTime);
        document.getElementById('white-timer-box').classList.toggle('active-timer', isWhiteTurn);
        document.getElementById('black-timer-box').classList.toggle('active-timer', !isWhiteTurn);
    }

    function createBoard(state) {
        isUpdatingUI = true;
        const { board, lastMove, whiteTurn } = state;
        chessboard.innerHTML = '';
        const boardContainer = document.getElementById('board-container');
        const existingCoords = boardContainer.querySelectorAll('.coordinate');
        existingCoords.forEach(coord => coord.remove());

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

                if (lastMove && ((lastMove.startRow === row && lastMove.startCol === col) || (lastMove.endRow === row && lastMove.endCol === col))) {
                    square.classList.add('last-move-highlight');
                }

                const piece = board[row][col];
                if (piece) {
                    const pieceElement = document.createElement('span');
                    pieceElement.classList.add('piece');
                    pieceElement.textContent = Game.pieceUnicode[piece];
                    pieceElement.dataset.piece = piece;
                    pieceElement.draggable = true;
                    square.appendChild(pieceElement);
                }
                chessboard.appendChild(square);
            }
        }

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        for (let i = 0; i < 8; i++) {
            const fileElement = document.createElement('div');
            fileElement.className = 'coordinate file';
            fileElement.textContent = files[i];
            fileElement.style.left = `${i * 12.5}%`;
            boardContainer.appendChild(fileElement);
            const rankElement = document.createElement('div');
            rankElement.className = 'coordinate rank';
            rankElement.textContent = ranks[i];
            rankElement.style.top = `${i * 12.5}%`;
            boardContainer.appendChild(rankElement);
        }

        if (Game.isKingInCheck(whiteTurn, board)) {
            const kingPosition = Game.findKing(whiteTurn, board);
            if (kingPosition) {
                const kingSquare = chessboard.querySelector(`[data-row='${kingPosition.row}'][data-col='${kingPosition.col}']`);
                if (kingSquare) kingSquare.classList.add('check');
            }
        }
        updateCapturedPanels(state.whiteCaptured, state.blackCaptured);
        updatePlayerInfo();
        isUpdatingUI = false;
    }
    
    function updatePlayerInfo() {
        // Clear existing player info
        document.querySelectorAll('.player-info').forEach(info => info.remove());

        const whitePlayerInfo = document.createElement('div');
        whitePlayerInfo.className = 'player-info';
        whitePlayerInfo.innerHTML = `<div class="player-avatar"></div> Player 1 (White)`;
        whiteCapturedPanel.appendChild(whitePlayerInfo);

        const blackPlayerInfo = document.createElement('div');
        blackPlayerInfo.className = 'player-info';
        blackPlayerInfo.innerHTML = `<div class="player-avatar"></div> Player 2 (Black)`;
        blackCapturedPanel.appendChild(blackPlayerInfo);
    }

    function updateCapturedPanels(whiteCaptured, blackCaptured) {
        whiteCapturedPanel.innerHTML = '';
        blackCapturedPanel.innerHTML = '';
        whiteCaptured.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece');
            pieceElement.textContent = Game.pieceUnicode[piece];
            whiteCapturedPanel.appendChild(pieceElement);
        });
        blackCaptured.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece');
            pieceElement.textContent = Game.pieceUnicode[piece];
            blackCapturedPanel.appendChild(pieceElement);
        });
    }
    
    function highlightValidMoves(startRow, startCol) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (Game.isValidMove(startRow, startCol, row, col)) {
                    const square = chessboard.querySelector(`[data-row='${row}'][data-col='${col}']`);
                    if (square) square.classList.add('valid-move');
                }
            }
        }
    }

    function clearHighlights() {
        const highlightedSquares = document.querySelectorAll('.valid-move, .selected, .hint-highlight');
        highlightedSquares.forEach(square => square.classList.remove('valid-move', 'selected', 'hint-highlight'));
    }

    function updateStatus(status) {
        statusDisplay.textContent = status;
    }

    function updateMoveHistory(move) {
        const moveElement = document.createElement('div');
        moveElement.textContent = move;
        moveHistoryPanel.appendChild(moveElement);
        moveHistoryPanel.scrollTop = moveHistoryPanel.scrollHeight;
    }

    function animateMove(startRow, startCol, endRow, endCol, callback) {
        if (callback) {
            callback();
        }
    }

    function showPromotionChoices(endRow, endCol, isWhite, callback) {
        const square = chessboard.querySelector(`[data-row='${endRow}'][data-col='${endCol}']`);
        const rect = square.getBoundingClientRect();
        promotionOverlay.style.display = 'block';
        promotionChoices.innerHTML = '';

        const pieces = ['q', 'r', 'b', 'n'];
        pieces.forEach(piece => {
            const choice = document.createElement('span');
            choice.className = 'promotion-choice';
            choice.dataset.piece = piece;
            choice.textContent = Game.pieceUnicode[isWhite ? piece.toUpperCase() : piece];
            choice.onclick = () => {
                callback(piece);
                promotionOverlay.style.display = 'none';
            };
            promotionChoices.appendChild(choice);
        });

        promotionChoices.style.left = `${rect.left}px`;
        promotionChoices.style.top = `${rect.top}px`;
    }

    function playSound(type) {
        if (type === 'capture') captureSound.play();
        else if (type === 'check') checkSound.play();
        else moveSound.play();
    }

    return {
        createBoard,
        updateTimers,
        highlightValidMoves,
        clearHighlights,
        updateStatus,
        updateMoveHistory,
        animateMove,
        playSound,
        showPromotionChoices
    };
})();