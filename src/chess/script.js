document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');
    const whiteTimerDisplay = document.getElementById('white-timer');
    const blackTimerDisplay = document.getElementById('black-timer');
    const moveHistoryPanel = document.getElementById('move-history');
    const moveSound = document.getElementById('move-sound');
    const captureSound = document.getElementById('capture-sound');
    const checkSound = document.getElementById('check-sound');

    let board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ];

    const pieceUnicode = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    let selectedPiece = null;
    let selectedSquare = null;
    let whiteTurn = true;

    let whiteCaptured = [];
    let blackCaptured = [];
    let moveHistory = [];
    let boardHistory = [];
    let fiftyMoveRuleCounter = 0;
    let lastMove = null;

    let whiteTime = 600; // 10 minutes in seconds
    let blackTime = 600;
    let timerInterval;

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateTimers() {
        whiteTimerDisplay.textContent = formatTime(whiteTime);
        blackTimerDisplay.textContent = formatTime(blackTime);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (whiteTurn) {
                whiteTime--;
            } else {
                blackTime--;
            }
            updateTimers();
            if (whiteTime === 0 || blackTime === 0) {
                clearInterval(timerInterval);
                const winner = whiteTime === 0 ? "Black" : "White";
                statusDisplay.textContent = `Time's up! ${winner} wins.`;
                chessboard.removeEventListener('click', handleSquareClick);
                chessboard.removeEventListener('dragstart', handleDragStart);
                chessboard.removeEventListener('dragover', handleDragOver);
                chessboard.removeEventListener('drop', handleDrop);
            }
        }, 1000);
    }

    function createBoard() {
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
                    pieceElement.textContent = pieceUnicode[piece];
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

        const kingInCheck = isKingInCheck(whiteTurn);
        if (kingInCheck) {
            const kingPosition = findKing(whiteTurn);
            const kingSquare = chessboard.querySelector(`[data-row='${kingPosition.row}'][data-col='${kingPosition.col}']`);
            if (kingSquare) {
                kingSquare.classList.add('check');
            }
        }

        updateCapturedPanels();
    }

    function updateCapturedPanels() {
        const whiteCapturedPanel = document.getElementById('white-captured');
        const blackCapturedPanel = document.getElementById('black-captured');
        whiteCapturedPanel.innerHTML = '';
        blackCapturedPanel.innerHTML = '';

        whiteCaptured.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece');
            pieceElement.textContent = pieceUnicode[piece];
            whiteCapturedPanel.appendChild(pieceElement);
        });

        blackCaptured.forEach(piece => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece');
            pieceElement.textContent = pieceUnicode[piece];
            blackCapturedPanel.appendChild(pieceElement);
        });
    }

    function isValidMove(startRow, startCol, endRow, endCol, checkingKing = false) {
        const piece = board[startRow][startCol];
        const targetPiece = board[endRow][endCol];

        if (targetPiece && (isWhite(piece) === isWhite(targetPiece))) {
            return false;
        }

        const pieceType = piece.toLowerCase();
        let isValidGeometry = false;
        if (pieceType === 'p') {
            isValidGeometry = isValidPawnMove(startRow, startCol, endRow, endCol, piece);
        } else if (pieceType === 'r') {
            isValidGeometry = isValidRookMove(startRow, startCol, endRow, endCol);
        } else if (pieceType === 'n') {
            isValidGeometry = isValidKnightMove(startRow, startCol, endRow, endCol);
        } else if (pieceType === 'b') {
            isValidGeometry = isValidBishopMove(startRow, startCol, endRow, endCol);
        } else if (pieceType === 'q') {
            isValidGeometry = isValidQueenMove(startRow, startCol, endRow, endCol);
        } else if (pieceType === 'k') {
            if (canCastle(startRow, startCol, endRow, endCol)) {
                return !isKingInCheck(isWhite(piece));
            }
            isValidGeometry = isValidKingMove(startRow, startCol, endRow, endCol);
        }

        if (!isValidGeometry) {
            return false;
        }

        if (checkingKing) {
            return true;
        }

        const originalPiece = board[endRow][endCol];
        board[endRow][endCol] = piece;
        board[startRow][startCol] = '';

        const kingInCheck = isKingInCheck(isWhite(piece));

        board[startRow][startCol] = piece;
        board[endRow][endCol] = originalPiece;

        return !kingInCheck;
    }

    function isWhite(piece) {
        return piece === piece.toUpperCase();
    }

    let whiteKingMoved = false;
    let blackKingMoved = false;
    let whiteRooksMoved = [false, false];
    let blackRooksMoved = [false, false];

    function isValidKingMove(startRow, startCol, endRow, endCol) {
        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);
        return rowDiff <= 1 && colDiff <= 1;
    }

    function canCastle(startRow, startCol, endRow, endCol) {
        if (isKingInCheck(whiteTurn)) {
            return null;
        }

        const isWhite = whiteTurn;
        const kingMoved = isWhite ? whiteKingMoved : blackKingMoved;
        if (kingMoved) {
            return null;
        }

        const row = isWhite ? 7 : 0;
        if (startRow !== row || startCol !== 4 || endRow !== row) {
            return null;
        }

        if (endCol === 2) {
            const rookMoved = isWhite ? whiteRooksMoved[0] : blackRooksMoved[0];
            if (rookMoved || board[row][1] || board[row][2] || board[row][3]) {
                return null;
            }
            if (isSquareAttacked(row, 2, !isWhite) || isSquareAttacked(row, 3, !isWhite) || isSquareAttacked(row, 4, !isWhite)) {
                return null;
            }
            return 'queenside';
        }

        if (endCol === 6) {
            const rookMoved = isWhite ? whiteRooksMoved[1] : blackRooksMoved[1];
            if (rookMoved || board[row][5] || board[row][6]) {
                return null;
            }
            if (isSquareAttacked(row, 4, !isWhite) || isSquareAttacked(row, 5, !isWhite) || isSquareAttacked(row, 6, !isWhite)) {
                return null;
            }
            return 'kingside';
        }

        return null;
    }

    function isSquareAttacked(row, col, byWhite) {
        const attackerPieces = getPieces(byWhite);
        for (const piece of attackerPieces) {
            if (isValidMove(piece.row, piece.col, row, col, true)) {
                return true;
            }
        }
        return false;
    }

    function isValidQueenMove(startRow, startCol, endRow, endCol) {
        return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
    }

    function isValidBishopMove(startRow, startCol, endRow, endCol) {
        if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) {
            return false;
        }

        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);

        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') {
                return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    function isValidKnightMove(startRow, startCol, endRow, endCol) {
        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    }

    function isValidRookMove(startRow, startCol, endRow, endCol) {
        if (startRow !== endRow && startCol !== endCol) {
            return false;
        }

        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);

        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') {
                return false;
            }
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    function isValidPawnMove(startRow, startCol, endRow, endCol, piece) {
        const direction = isWhite(piece) ? -1 : 1;
        const startRank = isWhite(piece) ? 6 : 1;

        if (startCol === endCol && board[endRow][endCol] === '' && endRow === startRow + direction) {
            return true;
        }

        if (startCol === endCol && board[endRow][endCol] === '' && startRow === startRank && endRow === startRow + 2 * direction) {
            return true;
        }

        if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction && board[endRow][endCol] !== '') {
            return true;
        }

        if (
            Math.abs(startCol - endCol) === 1 &&
            endRow === startRow + direction &&
            board[endRow][endCol] === '' &&
            lastMove &&
            lastMove.piece.toLowerCase() === 'p' &&
            Math.abs(lastMove.startRow - lastMove.endRow) === 2 &&
            lastMove.endRow === startRow &&
            lastMove.endCol === endCol
        ) {
            return true;
        }

        return false;
    }

    function handleSquareClick(event) {
        const square = event.target.closest('.square');
        if (!square) return;

        const row = parseInt(square.dataset.row);
        const col = parseInt(square.dataset.col);

        if (selectedPiece) {
            const startRow = parseInt(selectedSquare.dataset.row);
            const startCol = parseInt(selectedSquare.dataset.col);

            if (isValidMove(startRow, startCol, row, col)) {
                animateMove(startRow, startCol, row, col, () => {
                    movePiece(startRow, startCol, row, col);
                });
            }

            selectedPiece.parentElement.classList.remove('selected');
            selectedPiece = null;
            selectedSquare = null;
            clearHighlights();

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if ((whiteTurn && isWhite(piece)) || (!whiteTurn && !isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    selectedPiece.parentElement.classList.add('selected');
                    highlightValidMoves(row, col);
                }
            }
        }
    }

    function movePiece(startRow, startCol, endRow, endCol) {
        const piece = board[startRow][startCol];
        const capturedPiece = board[endRow][endCol];

        if (capturedPiece) {
            captureSound.play();
        } else {
            moveSound.play();
        }

        moveHistory.push(JSON.parse(JSON.stringify(board)));
        boardHistory.push(JSON.stringify(board));
        updateMoveHistory(piece, startRow, startCol, endRow, endCol, capturedPiece);

        if (capturedPiece) {
            if (isWhite(capturedPiece)) {
                blackCaptured.push(capturedPiece);
            } else {
                whiteCaptured.push(capturedPiece);
            }
            fiftyMoveRuleCounter = 0;
        } else if (piece.toLowerCase() === 'p') {
            fiftyMoveRuleCounter = 0;
        } else {
            fiftyMoveRuleCounter++;
        }

        if (piece.toLowerCase() === 'p' && !capturedPiece && Math.abs(startCol - endCol) === 1) {
            const capturedPawnRow = whiteTurn ? endRow + 1 : endRow - 1;
            board[capturedPawnRow][endCol] = '';
        }

        const castlingType = canCastle(startRow, startCol, endRow, endCol);
        if (piece.toLowerCase() === 'k' && castlingType) {
            if (castlingType === 'queenside') {
                const rook = board[startRow][0];
                board[startRow][0] = '';
                board[startRow][3] = rook;
            } else if (castlingType === 'kingside') {
                const rook = board[startRow][7];
                board[startRow][7] = '';
                board[startRow][5] = rook;
            }
        }
        board[startRow][startCol] = '';
        board[endRow][endCol] = piece;

        lastMove = { piece, startRow, startCol, endRow, endCol };

        if (piece === 'K') whiteKingMoved = true;
        if (piece === 'k') blackKingMoved = true;
        if (piece === 'R' && startCol === 0) whiteRooksMoved[0] = true;
        if (piece === 'R' && startCol === 7) whiteRooksMoved[1] = true;
        if (piece === 'r' && startCol === 0) blackRooksMoved[0] = true;
        if (piece === 'r' && startCol === 7) blackRooksMoved[1] = true;

        if (piece.toLowerCase() === 'p' && (endRow === 0 || endRow === 7)) {
            const promotionModal = document.getElementById('promotion-modal');
            promotionModal.style.display = 'block';

            const promotionChoices = document.getElementById('promotion-choices');
            promotionChoices.onclick = (event) => {
                const newPiece = event.target.dataset.piece;
                board[endRow][endCol] = whiteTurn ? newPiece.toUpperCase() : newPiece.toLowerCase();
                promotionModal.style.display = 'none';
                createBoard();
            }
        } else {
            createBoard();
        }

        whiteTurn = !whiteTurn;
        let status = whiteTurn ? "White's turn" : "Black's turn";

        if (isCheckmate(whiteTurn)) {
            status = "Checkmate! " + (whiteTurn ? "Black" : "White") + " wins.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (isStalemate(whiteTurn)) {
            status = "Stalemate! It's a draw.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (isKingInCheck(whiteTurn)) {
            status = (whiteTurn ? "White" : "Black") + " is in check.";
            checkSound.play();
        } else if (isThreefoldRepetition()) {
            status = "Draw by threefold repetition.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (fiftyMoveRuleCounter >= 100) {
            status = "Draw by fifty-move rule.";
            chessboard.removeEventListener('click', handleSquareClick);
        }
        statusDisplay.textContent = status;
    }

    function isThreefoldRepetition() {
        const lastBoard = boardHistory[boardHistory.length - 1];
        const repetitions = boardHistory.filter(b => b === lastBoard).length;
        return repetitions >= 3;
    }

    function toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece) {
        // Handle castling notation
        if (piece.toLowerCase() === 'k' && Math.abs(startCol - endCol) === 2) {
            return endCol === 6 ? 'O-O' : 'O-O-O';
        }

        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const captureSymbol = capturedPiece ? 'x' : '';
        return `${pieceSymbol}${files[startCol]}${8-startRow}${captureSymbol}${files[endCol]}${8-endRow}`;
    }

...

    const newGameButton = document.getElementById('new-game-button');
    const resignButton = document.getElementById('resign-button');
    const flipBoardButton = document.getElementById('flip-board-button');
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationMessage = document.getElementById('confirmation-message');
    const confirmYesButton = document.getElementById('confirm-yes');
    const confirmNoButton = document.getElementById('confirm-no');

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

    newGameButton.addEventListener('click', () => {
        showConfirmation('Are you sure you want to start a new game?', () => {
            location.reload();
        });
    });

    resignButton.addEventListener('click', () => {
        showConfirmation('Are you sure you want to resign?', () => {
            const winner = whiteTurn ? "Black" : "White";
            statusDisplay.textContent = `${winner} wins by resignation.`;
            chessboard.removeEventListener('click', handleSquareClick);
            hideConfirmation();
        });
    });

    confirmYesButton.addEventListener('click', () => {
        if (confirmAction) {
            confirmAction();
        }
    });

    confirmNoButton.addEventListener('click', () => {
        hideConfirmation();
    });

    flipBoardButton.addEventListener('click', () => {
        chessboard.classList.toggle('flipped');
    });

    const takebackButton = document.getElementById('takeback-button');
    takebackButton.addEventListener('click', () => {
        if (moveHistory.length > 0) {
            board = moveHistory.pop();
            whiteTurn = !whiteTurn;
            createBoard();
        }
    });
});
