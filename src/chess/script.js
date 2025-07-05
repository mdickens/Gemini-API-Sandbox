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

    function isValidKingMove(startRow, startCol, endRow, endCol) {
        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);
        return rowDiff <= 1 && colDiff <= 1;
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
                board[startRow][startCol] = '';
                board[row][col] = piece;

                createBoard();

                whiteTurn = !whiteTurn;
                statusDisplay.textContent = whiteTurn ? "White's turn" : "Black's turn";
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

    createBoard();
    chessboard.addEventListener('click', handleSquareClick);
});
