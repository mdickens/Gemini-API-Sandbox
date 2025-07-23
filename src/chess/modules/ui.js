// ui.js

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
    const gameEndSound = document.getElementById('game-end-sound');
    const drawSound = document.getElementById('draw-sound');

    let currentPieceSet = 'unicode';

    function setPieceSet(setName) {
        currentPieceSet = setName;
    }

    function applyTheme(themeName) {
        document.body.className = `theme-${themeName}`;
    }

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
                    const pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece');
                    
                    if (currentPieceSet === 'unicode') {
                        pieceElement.textContent = Game.pieceUnicode[piece];
                    } else {
                        const pieceImg = document.createElement('img');
                        pieceImg.src = PIECES[currentPieceSet][piece];
                        pieceElement.appendChild(pieceImg);
                    }
                    
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
    }
    
    function updatePlayerInfo() {
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
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece');
            if (currentPieceSet === 'unicode') {
                pieceElement.textContent = Game.pieceUnicode[piece];
            } else {
                const pieceImg = document.createElement('img');
                pieceImg.src = PIECES[currentPieceSet][piece];
                pieceElement.appendChild(pieceImg);
            }
            whiteCapturedPanel.appendChild(pieceElement);
        });
        blackCaptured.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece');
            if (currentPieceSet === 'unicode') {
                pieceElement.textContent = Game.pieceUnicode[piece];
            } else {
                const pieceImg = document.createElement('img');
                pieceImg.src = PIECES[currentPieceSet][piece];
                pieceElement.appendChild(pieceImg);
            }
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

    function updateMoveHistory(moveNumber, moveNotation, isWhiteTurn) {
        let moveIndex = Game.getState().moveHistory.length - 1;
        if (isWhiteTurn) {
            const moveEntry = document.createElement('div');
            moveEntry.className = 'move-entry';
            moveEntry.innerHTML = `<span class="move-number">${moveNumber}.</span> <span class="move-white" data-move-index="${moveIndex}">${moveNotation}</span>`;
            moveHistoryPanel.appendChild(moveEntry);
        } else {
            const lastMoveEntry = moveHistoryPanel.lastElementChild;
            if (lastMoveEntry) {
                lastMoveEntry.innerHTML += ` <span class="move-black" data-move-index="${moveIndex}">${moveNotation}</span>`;
            }
        }
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

    function showPromotionChoices(endRow, endCol, isWhite, callback) {
        const square = chessboard.querySelector(`[data-row='${endRow}'][data-col='${endCol}']`);
        const rect = square.getBoundingClientRect();
        promotionOverlay.style.display = 'block';
        promotionChoices.innerHTML = '';

        const pieces = ['q', 'r', 'b', 'n'];
        pieces.forEach(piece => {
            const choice = document.createElement('div');
            choice.className = 'promotion-choice';
            choice.dataset.piece = piece;
            
            if (currentPieceSet === 'unicode') {
                choice.textContent = Game.pieceUnicode[isWhite ? piece.toUpperCase() : piece];
            } else {
                const pieceImg = document.createElement('img');
                pieceImg.src = PIECES[currentPieceSet][isWhite ? piece.toUpperCase() : piece];
                choice.appendChild(pieceImg);
            }

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
        else if (type === 'game-end') gameEndSound.play();
        else if (type === 'draw') drawSound.play();
        else moveSound.play();
    }

    function bindEventListeners(handleSquareClick, handleDragStart, handleDrop) {
        chessboard.addEventListener('click', handleSquareClick);

        chessboard.addEventListener('dragstart', handleDragStart);

        chessboard.addEventListener('dragover', (event) => {
            event.preventDefault();
        });

        chessboard.addEventListener('drop', handleDrop);
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
        showPromotionChoices,
        setPieceSet,
        applyTheme,
        bindEventListeners
    };
})();