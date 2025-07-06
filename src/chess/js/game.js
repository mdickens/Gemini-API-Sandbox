import { board, pieceUnicode } from './board.js';

export let whiteTurn = true;
export let whiteKingMoved = false;
export let blackKingMoved = false;
export let whiteRooksMoved = [false, false];
export let blackRooksMoved = [false, false];
export let moveHistory = [];
export let whiteCaptured = [];
export let blackCaptured = [];

export function isValidMove(startRow, startCol, endRow, endCol, checkingKing = false) {
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
        if(checkingKing) {
            const rowDiff = Math.abs(startRow - endRow);
            const colDiff = Math.abs(startCol - endCol);
            return rowDiff <= 1 && colDiff <= 1;
        }
        return isValidKingMove(startRow, startCol, endRow, endCol);
    }
    return false;
}

export function isWhite(piece) {
    return piece === piece.toUpperCase();
}

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

    return false;
}

export function getPieces(isWhitePlayer) {
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

export function hasValidMoves(isWhitePlayer) {
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

export function isCheckmate(isWhitePlayer) {
    return isKingInCheck(isWhitePlayer) && !hasValidMoves(isWhitePlayer);
}

export function isStalemate(isWhitePlayer) {
    return !isKingInCheck(isWhitePlayer) && !hasValidMoves(isWhitePlayer);
}

export function findKing(isWhiteKing) {
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

export function isKingInCheck(isWhiteKing) {
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
