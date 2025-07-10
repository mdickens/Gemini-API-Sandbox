import { board, createBoard } from './js/board.js';
import {
    whiteTurn,
    moveHistory,
    isValidMove,
    isCheckmate,
    isStalemate,
    whiteKingMoved,
    blackKingMoved,
    whiteRooksMoved,
    blackRooksMoved,
    whiteCaptured,
    blackCaptured,
    setLastMove,
    lastMove
} from './js/game.js';
import {
    updateCapturedPanels,
    highlightValidMoves,
    clearHighlights,
    updateTimers
} from './js/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const chessboard = document.getElementById('chessboard');
    const statusDisplay = document.getElementById('status');

    let selectedPiece = null;
    let selectedSquare = null;

    let whiteTime = 600; // 10 minutes in seconds
    let blackTime = 600;
    let timerInterval;

    function startTimer() {
        timerInterval = setInterval(() => {
            if (whiteTurn) {
                whiteTime--;
            } else {
                blackTime--;
            }
            updateTimers(whiteTime, blackTime);
            if (whiteTime === 0 || blackTime === 0) {
                clearInterval(timerInterval);
                const winner = whiteTime === 0 ? "Black" : "White";
                statusDisplay.textContent = `Time's up! ${winner} wins.`;
                chessboard.removeEventListener('click', handleSquareClick);
            }
        }, 1000);
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
                const capturedPiece = board[row][col];

                moveHistory.push(JSON.parse(JSON.stringify(board)));

                if (capturedPiece) {
                    if (isWhite(capturedPiece)) {
                        blackCaptured.push(capturedPiece);
                    } else {
                        whiteCaptured.push(capturedPiece);
                    }
                }

                // Handle en passant
                if (piece.toLowerCase() === 'p' && !capturedPiece && Math.abs(startCol - col) === 1) {
                    const capturedPawnRow = whiteTurn ? row + 1 : row - 1;
                    board[capturedPawnRow][col] = '';
                }

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

                setLastMove({ piece, startRow, startCol, endRow: row, endCol: col });


                // Update moved flags
                if (piece === 'K') whiteKingMoved = true;
                if (piece === 'k') blackKingMoved = true;
                if (piece === 'R' && startCol === 0) whiteRooksMoved[0] = true;
                if (piece === 'R' && startCol === 7) whiteRooksMoved[1] = true;
                if (piece === 'r' && startCol === 0) blackRooksMoved[0] = true;
                if (piece === 'r' && startCol === 7) blackRooksMoved[1] = true;


                // Pawn Promotion
                if (piece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
                    const promotionModal = document.getElementById('promotion-modal');
                    promotionModal.style.display = 'block';

                    const promotionChoices = document.getElementById('promotion-choices');
                    promotionChoices.onclick = (event) => {
                        const newPiece = event.target.dataset.piece;
                        board[row][col] = whiteTurn ? newPiece.toUpperCase() : newPiece.toLowerCase();
                        promotionModal.style.display = 'none';
                        createBoard(chessboard);
                    }
                } else {
                    createBoard(chessboard);
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
                }
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
                    highlightValidMoves(row, col, isValidMove);
                }
            }
        }
    }

    createBoard(chessboard);
    chessboard.addEventListener('click', handleSquareClick);
    startTimer();
    updateTimers(whiteTime, blackTime);

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
            createBoard(chessboard);
        }
    });

    const resignButton = document.getElementById('resign-button');
    resignButton.addEventListener('click', () => {
        const winner = whiteTurn ? "Black" : "White";
        statusDisplay.textContent = `${winner} wins by resignation.`;
        chessboard.removeEventListener('click', handleSquareClick);
    });
});
