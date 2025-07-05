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

    createBoard();

    chessboard.addEventListener('click', (event) => {
        const square = event.target.closest('.square');
        if (!square) return;

        if (selectedPiece) {
            // Move piece
            const targetRow = parseInt(square.dataset.row);
            const targetCol = parseInt(square.dataset.col);

            const piece = selectedPiece.dataset.piece;
            board[selectedSquare.dataset.row][selectedSquare.dataset.col] = '';
            board[targetRow][targetCol] = piece;

            createBoard(); // Redraw board

            // Switch turns
            whiteTurn = !whiteTurn;
            statusDisplay.textContent = whiteTurn ? "White's turn" : "Black's turn";

            selectedPiece = null;
            selectedSquare = null;
        } else {
            // Select piece
            const pieceElement = square.querySelector('.piece');
            if (pieceElement) {
                const piece = pieceElement.dataset.piece;
                const isWhitePiece = piece === piece.toUpperCase();

                if ((whiteTurn && isWhitePiece) || (!whiteTurn && !isWhitePiece)) {
                    selectedPiece = pieceElement;
                    selectedSquare = square;
                }
            }
        }
    });
});
