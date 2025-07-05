document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');

    const board = [
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
    }

    function isValidMove(startRow, startCol, endRow, endCol) {
        const piece = board[startRow][startCol];
        const targetPiece = board[endRow][endCol];

        // General validation
        if (targetPiece && (isWhite(piece) === isWhite(targetPiece))) {
            return false; // Can't capture same color piece
        }

        const pieceType = piece.toLowerCase();
        if (pieceType === 'p') {
            return isValidPawnMove(startRow, startCol, endRow, endCol, piece);
        }
        if (pieceType === 'r') {
            return isValidRookMove(startRow, startCol, endRow, endCol);
        }
        if (pieceType === 'n') {
            return isValidKnightMove(startRow, startCol, endRow, endCol);
        }
        if (pieceType === 'b') {
            return isValidBishopMove(startRow, startCol, endRow, endCol);
        }
        if (pieceType === 'q') {
            return isValidQueenMove(startRow, startCol, endRow, endCol);
        }
        if (pieceType === 'k') {
            return isValidKingMove(startRow, startCol, endRow, endCol);
        }
        return false;
    }
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
            if (isValidMove(piece.row, piece.col, row, col)) {
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
                const piece = selectedPiece.dataset.piece;

                // Handle castling
                if (piece.toLowerCase() === 'k' && Math.abs(startCol - col) === 2) {
                    const rookCol = col === 2 ? 0 : 7;
                    const newRookCol = col === 2 ? 3 : 5;
                    const rook = board[row][rookCol];
                    board[row][rookCol] = '';
                    board[row][newRookCol] = rook;
                }

                board[startRow][startCol] = '';
                board[row][col] = piece;

                // Update moved flags
                if (piece === 'K') whiteKingMoved = true;
                if (piece === 'k') blackKingMoved = true;
                if (piece === 'R' && startCol === 0) whiteRooksMoved[0] = true;
                if (piece === 'R' && startCol === 7) whiteRooksMoved[1] = true;
                if (piece === 'r' && startCol === 0) blackRooksMoved[0] = true;
                if (piece === 'r' && startCol === 7) blackRooksMoved[1] = true;


                // Pawn Promotion
                if (piece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                    const newPiece = prompt("Promote to (q, r, b, n):", "q");
                    board[row][col] = whiteTurn ? newPiece.toUpperCase() : newPiece.toLowerCase();
                }

                createBoard();

                whiteTurn = !whiteTurn;
                let status = whiteTurn ? "White's turn" : "Black's turn";
                statusDisplay.textContent = status;

                if (isCheckmate(whiteTurn)) {
                    statusDisplay.textContent = "Checkmate! " + (whiteTurn ? "Black" : "White") + " wins.";
                    chessboard.removeEventListener('click', handleSquareClick);
                } else if (isStalemate(whiteTurn)) {
                    statusDisplay.textContent = "Stalemate! It's a draw.";
                    chessboard.removeEventListener('click', handleSquareClick);
                }
            }

            selectedPiece.parentElement.classList.remove('selected');
            selectedPiece = null;
            selectedSquare = null;

        } else {
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                if ((whiteTurn && isWhite(piece)) || (!whiteTurn && !isWhite(piece))) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                    selectedPiece.parentElement.classList.add('selected');
                }
            }
        }
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
                    if (isValidMove(row, col, kingPosition.row, kingPosition.col)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    createBoard();
    chessboard.addEventListener('click', handleSquareClick);
});
