document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');
    const whiteTimerDisplay = document.getElementById('white-timer');
    const blackTimerDisplay = document.getElementById('black-timer');
    const moveHistoryPanel = document.getElementById('move-history');

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
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.classList.add('square');
                square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
                square.dataset.row = row;
                square.dataset.col = col;

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

        // General validation
        if (targetPiece && (isWhite(piece) === isWhite(targetPiece))) {
            return false; // Can't capture same color piece
        }

        const pieceType = piece.toLowerCase();
        if (pieceType === 'p') {
            if (!isValidPawnMove(startRow, startCol, endRow, endCol, piece)) return false;
        } else if (pieceType === 'r') {
            if (!isValidRookMove(startRow, startCol, endRow, endCol)) return false;
        } else if (pieceType === 'n') {
            if (!isValidKnightMove(startRow, startCol, endRow, endCol)) return false;
        } else if (pieceType === 'b') {
            if (!isValidBishopMove(startRow, startCol, endRow, endCol)) return false;
        } else if (pieceType === 'q') {
            if (!isValidQueenMove(startRow, startCol, endRow, endCol)) return false;
        } else if (pieceType === 'k') {
            if(checkingKing) {
                const rowDiff = Math.abs(startRow - endRow);
                const colDiff = Math.abs(startCol - endCol);
                return rowDiff <= 1 && colDiff <= 1;
            }
            if (!isValidKingMove(startRow, startCol, endRow, endCol)) return false;
        }

        // Simulate the move
        const originalPiece = board[endRow][endCol];
        board[endRow][endCol] = piece;
        board[startRow][startCol] = '';

        const kingInCheck = isKingInCheck(isWhite(piece));

        // Revert the move
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

        if (rowDiff <= 1 && colDiff <= 1) {
            return true;
        }

        return isValidCastling(startRow, startCol, endRow, endCol);
    }

    function isValidCastling(startRow, startCol, endRow, endCol) {
        if (isKingInCheck(whiteTurn)) {
            return false;
        }

        const isWhite = whiteTurn;
        const kingMoved = isWhite ? whiteKingMoved : blackKingMoved;
        if (kingMoved) {
            return false;
        }

        const row = isWhite ? 7 : 0;
        if (startRow !== row || startCol !== 4 || endRow !== row) {
            return false;
        }

        // Queenside
        if (endCol === 2) {
            const rookMoved = isWhite ? whiteRooksMoved[0] : blackRooksMoved[0];
            if (rookMoved || board[row][1] || board[row][2] || board[row][3]) {
                return false;
            }
            return !isSquareAttacked(row, 3, !isWhite) && !isSquareAttacked(row, 4, !isWhite);
        }

        // Kingside
        if (endCol === 6) {
            const rookMoved = isWhite ? whiteRooksMoved[1] : blackRooksMoved[1];
            if (rookMoved || board[row][5] || board[row][6]) {
                return false;
            }
            return !isSquareAttacked(row, 5, !isWhite) && !isSquareAttacked(row, 4, !isWhite);
        }

        return false;
    }

    function isSquareAttacked(row, col, byWhite) {
        const opponentPieces = getPieces(!byWhite);
        for (const piece of opponentPieces) {
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
            return false; // Not a diagonal line
        }

        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);

        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') {
                return false; // Path is blocked
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
            return false; // Not a straight line
        }

        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);

        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;

        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') {
                return false; // Path is blocked
            }
            currentRow += rowStep;
            currentCol += colStep;
        }

        return true;
    }

    function isValidPawnMove(startRow, startCol, endRow, endCol, piece) {
        const direction = isWhite(piece) ? -1 : 1;
        const startRank = isWhite(piece) ? 6 : 1;

        // Standard one-square move
        if (startCol === endCol && board[endRow][endCol] === '' && endRow === startRow + direction) {
            return true;
        }

        // Initial two-square move
        if (startCol === endCol && board[endRow][endCol] === '' && startRow === startRank && endRow === startRow + 2 * direction) {
            return true;
        }

        // Capture move
        if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction && board[endRow][endCol] !== '') {
            return true;
        }

        // En passant
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
                movePiece(startRow, startCol, row, col);
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

        // Handle en passant
        if (piece.toLowerCase() === 'p' && !capturedPiece && Math.abs(startCol - endCol) === 1) {
            const capturedPawnRow = whiteTurn ? endRow + 1 : endRow - 1;
            board[capturedPawnRow][endCol] = '';
        }

        // Handle castling
        if (piece.toLowerCase() === 'k' && Math.abs(startCol - endCol) === 2) {
            const rookCol = endCol === 2 ? 0 : 7;
            const newRookCol = endCol === 2 ? 3 : 5;
            const rook = board[endRow][rookCol];
            board[endRow][rookCol] = '';
            board[endRow][newRookCol] = rook;
        }
        board[startRow][startCol] = '';
        board[endRow][endCol] = piece;

        lastMove = { piece, startRow, startCol, endRow, endCol };


        // Update moved flags
        if (piece === 'K') whiteKingMoved = true;
        if (piece === 'k') blackKingMoved = true;
        if (piece === 'R' && startCol === 0) whiteRooksMoved[0] = true;
        if (piece === 'R' && startCol === 7) whiteRooksMoved[1] = true;
        if (piece === 'r' && startCol === 0) blackRooksMoved[0] = true;
        if (piece === 'r' && startCol === 7) blackRooksMoved[1] = true;


        // Pawn Promotion
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
        statusDisplay.textContent = status;

        if (isCheckmate(whiteTurn)) {
            statusDisplay.textContent = "Checkmate! " + (whiteTurn ? "Black" : "White") + " wins.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (isStalemate(whiteTurn)) {
            statusDisplay.textContent = "Stalemate! It's a draw.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (isThreefoldRepetition()) {
            statusDisplay.textContent = "Draw by threefold repetition.";
            chessboard.removeEventListener('click', handleSquareClick);
        } else if (fiftyMoveRuleCounter >= 100) {
            statusDisplay.textContent = "Draw by fifty-move rule.";
            chessboard.removeEventListener('click', handleSquareClick);
        }
    }

    function isThreefoldRepetition() {
        const lastBoard = boardHistory[boardHistory.length - 1];
        const repetitions = boardHistory.filter(b => b === lastBoard).length;
        return repetitions >= 3;
    }

    function toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
        const captureSymbol = capturedPiece ? 'x' : '';
        return `${pieceSymbol}${files[startCol]}${8-startRow}${captureSymbol}${files[endCol]}${8-endRow}`;
    }

    function updateMoveHistory(piece, startRow, startCol, endRow, endCol, capturedPiece) {
        const move = toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece);
        const moveElement = document.createElement('div');
        moveElement.textContent = move;
        moveHistoryPanel.appendChild(moveElement);
    }

    function highlightValidMoves(startRow, startCol) {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (isValidMove(startRow, startCol, row, col)) {
                    const square = chessboard.querySelector(`[data-row='${row}'][data-col='${col}']`);
                    if (square) {
                        square.classList.add('valid-move');
                    }
                }
            }
        }
    }

    function clearHighlights() {
        const highlightedSquares = document.querySelectorAll('.valid-move');
        highlightedSquares.forEach(square => square.classList.remove('valid-move'));
    }

    function getPieces(isWhitePlayer) {
        const pieces = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && isWhite(piece) === isWhitePlayer) {
                    pieces.push({ piece, row, col });
                }
            }
        }
        return pieces;
    }

    function hasValidMoves(isWhitePlayer) {
        const pieces = getPieces(isWhitePlayer);
        for (const piece of pieces) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (isValidMove(piece.row, piece.col, row, col)) {
                        // Simulate move
                        const originalPiece = board[row][col];
                        board[row][col] = piece.piece;
                        board[piece.row][piece.col] = '';
                        if (!isKingInCheck(isWhitePlayer)) {
                            board[piece.row][piece.col] = piece.piece;
                            board[row][col] = originalPiece;
                            return true;
                        }
                        board[piece.row][piece.col] = piece.piece;
                        board[row][col] = originalPiece;
                    }
                }
            }
        }
        return false;
    }

    function isCheckmate(isWhitePlayer) {
        return isKingInCheck(isWhitePlayer) && !hasValidMoves(isWhitePlayer);
    }

    function isStalemate(isWhitePlayer) {
        return !isKingInCheck(isWhitePlayer) && !hasValidMoves(isWhitePlayer);
    }

    function findKing(isWhiteKing) {
        const king = isWhiteKing ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === king) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    function isKingInCheck(isWhiteKing) {
        const kingPosition = findKing(isWhiteKing);
        if (!kingPosition) return false;

        const opponentColor = isWhiteKing ? 'black' : 'white';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && (isWhite(piece) !== isWhiteKing)) {
                    if (isValidMove(row, col, kingPosition.row, kingPosition.col, true)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    let draggedPiece = null;

    function handleDragStart(event) {
        draggedPiece = event.target;
        event.dataTransfer.setData('text/plain', event.target.dataset.piece);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        const targetSquare = event.target.closest('.square');
        if (!targetSquare) return;

        const startRow = parseInt(draggedPiece.parentElement.dataset.row);
        const startCol = parseInt(draggedPiece.parentElement.dataset.col);
        const endRow = parseInt(targetSquare.dataset.row);
        const endCol = parseInt(targetSquare.dataset.col);

        if (isValidMove(startRow, startCol, endRow, endCol)) {
            movePiece(startRow, startCol, endRow, endCol);
        }
    }

    createBoard();
    chessboard.addEventListener('click', handleSquareClick);
    chessboard.addEventListener('dragstart', handleDragStart);
    chessboard.addEventListener('dragover', handleDragOver);
    chessboard.addEventListener('drop', handleDrop);
    startTimer();
    updateTimers();

    const helpButton = document.getElementById('help-button');
    const modal = document.getElementById('help-modal');
    const closeButton = document.getElementsByClassName('close-button')[0];

    helpButton.onclick = function() {
        modal.style.display = 'block';
    }

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    const newGameButton = document.getElementById('new-game-button');
    newGameButton.addEventListener('click', () => {
        location.reload();
    });

    const takebackButton = document.getElementById('takeback-button');
    takebackButton.addEventListener('click', () => {
        if (moveHistory.length > 0) {
            board = moveHistory.pop();
            whiteTurn = !whiteTurn;
            createBoard();
        }
    });

    const resignButton = document.getElementById('resign-button');
    resignButton.addEventListener('click', () => {
        const winner = whiteTurn ? "Black" : "White";
        statusDisplay.textContent = `${winner} wins by resignation.`;
        chessboard.removeEventListener('click', handleSquareClick);
    });
});
