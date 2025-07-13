// ui.js

const UI = (() => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');
    const whiteTimerDisplay = document.getElementById('white-timer');
    const blackTimerDisplay = document.getElementById('black-timer');
    const moveHistoryPanel = document.getElementById('move-history');
    const whiteCapturedPanel = document.getElementById('white-captured');
    const blackCapturedPanel = document.getElementById('black-captured');
    const promotionModal = document.getElementById('promotion-modal');
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
        const highlightedSquares = document.querySelectorAll('.valid-move, .selected');
        highlightedSquares.forEach(square => square.classList.remove('valid-move', 'selected'));
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
        const startSquare = chessboard.querySelector(`[data-row='${startRow}'][data-col='${startCol}']`);
        const endSquare = chessboard.querySelector(`[data-row='${endRow}'][data-col='${endCol}']`);
        const pieceElement = startSquare.querySelector('.piece');
        if (!pieceElement) return;

        const startRect = startSquare.getBoundingClientRect();
        const endRect = endSquare.getBoundingClientRect();
        const chessboardRect = chessboard.getBoundingClientRect();
        const clone = pieceElement.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = `${startRect.left - chessboardRect.left}px`;
        clone.style.top = `${startRect.top - chessboardRect.top}px`;
        clone.style.zIndex = 1000;
        chessboard.appendChild(clone);
        pieceElement.style.opacity = 0;

        requestAnimationFrame(() => {
            const offsetX = endRect.left - startRect.left;
            const offsetY = endRect.top - startRect.top;
            clone.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            clone.style.transition = 'transform 0.3s ease';
        });

        clone.addEventListener('transitionend', function handler() {
            clone.removeEventListener('transitionend', handler);
            clone.remove();
            callback();
        });
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
        promotionModal,
        promotionChoices
    };
})();
