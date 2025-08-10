// game.js

const Game = (() => {
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

    let whiteTurn = true;
    let whiteKingMoved = false;
    let blackKingMoved = false;
    let whiteRooksMoved = [false, false];
    let blackRooksMoved = [false, false];
    let fiftyMoveRuleCounter = 0;
    let lastMove = null;
    let moveHistory = [];
    let boardHistory = [];
    let whiteCaptured = [];
    let blackCaptured = [];

    const pieceUnicode = {
        'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
        'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
    };

    function getState() {
        return {
            board,
            whiteTurn,
            whiteKingMoved,
            blackKingMoved,
            whiteRooksMoved,
            blackRooksMoved,
            fiftyMoveRuleCounter,
            lastMove,
            moveHistory,
            boardHistory,
            whiteCaptured,
            blackCaptured
        };
    }

    function setState(state) {
        board = state.board;
        whiteTurn = state.whiteTurn;
        whiteKingMoved = state.whiteKingMoved;
        blackKingMoved = state.blackKingMoved;
        whiteRooksMoved = state.whiteRooksMoved;
        blackRooksMoved = state.blackRooksMoved;
        fiftyMoveRuleCounter = state.fiftyMoveRuleCounter;
        lastMove = state.lastMove;
        moveHistory = state.moveHistory;
        boardHistory = state.boardHistory;
        whiteCaptured = state.whiteCaptured;
        blackCaptured = state.blackCaptured;
    }

    function isWhite(piece) {
        return piece === piece.toUpperCase();
    }

    function isValidKingMove(startRow, startCol, endRow, endCol) {
        const rowDiff = Math.abs(startRow - endRow);
        const colDiff = Math.abs(startCol - endCol);
        return rowDiff <= 1 && colDiff <= 1;
    }

    function canCastle(startRow, startCol, endRow, endCol) {
        if (isKingInCheck(whiteTurn)) return null;
        const isWhitePlayer = whiteTurn;
        const kingMoved = isWhitePlayer ? whiteKingMoved : blackKingMoved;
        if (kingMoved) return null;

        const row = isWhitePlayer ? 7 : 0;
        if (startRow !== row || startCol !== 4 || endRow !== row) return null;

        if (endCol === 2) { // Queenside
            const rookMoved = isWhitePlayer ? whiteRooksMoved[0] : blackRooksMoved[0];
            if (rookMoved || board[row][1] || board[row][2] || board[row][3]) return null;
            if (isSquareAttacked(row, 4, !isWhitePlayer) || isSquareAttacked(row, 3, !isWhitePlayer) || isSquareAttacked(row, 2, !isWhitePlayer)) return null;
            return 'queenside';
        }

        if (endCol === 6) { // Kingside
            const rookMoved = isWhitePlayer ? whiteRooksMoved[1] : blackRooksMoved[1];
            if (rookMoved || board[row][5] || board[row][6]) return null;
            if (isSquareAttacked(row, 4, !isWhitePlayer) || isSquareAttacked(row, 5, !isWhitePlayer) || isSquareAttacked(row, 6, !isWhitePlayer)) return null;
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
        if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false;
        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);
        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;
        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') return false;
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
        if (startRow !== endRow && startCol !== endCol) return false;
        const rowStep = Math.sign(endRow - startRow);
        const colStep = Math.sign(endCol - startCol);
        let currentRow = startRow + rowStep;
        let currentCol = startCol + colStep;
        while (currentRow !== endRow || currentCol !== endCol) {
            if (board[currentRow][currentCol] !== '') return false;
            currentRow += rowStep;
            currentCol += colStep;
        }
        return true;
    }

    function isValidPawnMove(startRow, startCol, endRow, endCol, piece) {
        const direction = isWhite(piece) ? -1 : 1;
        const startRank = isWhite(piece) ? 6 : 1;
        if (startCol === endCol && board[endRow][endCol] === '' && endRow === startRow + direction) return true;
        if (startCol === endCol && board[endRow][endCol] === '' && startRow === startRank && endRow === startRow + 2 * direction) {
            const middleRow = startRow + direction;
            if (board[middleRow][startCol] === '') {
                return true;
            }
        }
        if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction && board[endRow][endCol] !== '') return true;
        if (Math.abs(startCol - endCol) === 1 && endRow === startRow + direction && board[endRow][endCol] === '' && lastMove && lastMove.piece.toLowerCase() === 'p' && Math.abs(lastMove.startRow - lastMove.endRow) === 2 && lastMove.endRow === startRow && lastMove.endCol === endCol) return true;
        return false;
    }

    function isValidMove(startRow, startCol, endRow, endCol, checkingKing = false) {
        const piece = board[startRow][startCol];
        if (!piece) return false;
        if (isWhite(piece) !== whiteTurn && !checkingKing) return false;
        const targetPiece = board[endRow][endCol];
        if (targetPiece && (isWhite(piece) === isWhite(targetPiece))) return false;

        const pieceType = piece.toLowerCase();
        let isValidGeometry = false;
        if (pieceType === 'p') isValidGeometry = isValidPawnMove(startRow, startCol, endRow, endCol, piece);
        else if (pieceType === 'r') isValidGeometry = isValidRookMove(startRow, startCol, endRow, endCol);
        else if (pieceType === 'n') isValidGeometry = isValidKnightMove(startRow, startCol, endRow, endCol);
        else if (pieceType === 'b') isValidGeometry = isValidBishopMove(startRow, startCol, endRow, endCol);
        else if (pieceType === 'q') isValidGeometry = isValidQueenMove(startRow, startCol, endRow, endCol);
        else if (pieceType === 'k') {
            if (!checkingKing && canCastle(startRow, startCol, endRow, endCol)) {
                return true;
            }
            isValidGeometry = isValidKingMove(startRow, startCol, endRow, endCol);
        }

        if (!isValidGeometry) return false;
        if (checkingKing) return true;

        const originalPiece = board[endRow][endCol];
        board[endRow][endCol] = piece;
        board[startRow][startCol] = '';
        const kingInCheck = isKingInCheck(isWhite(piece));
        board[startRow][startCol] = piece;
        board[endRow][endCol] = originalPiece;
        return !kingInCheck;
    }

    function movePiece(startRow, startCol, endRow, endCol) {
        const piece = board[startRow][startCol];
        const capturedPiece = board[endRow][endCol];
	console.log('movePiece')

        moveHistory.push(JSON.parse(JSON.stringify(board)));
        boardHistory.push(JSON.stringify(board));

        if (capturedPiece) {
            if (isWhite(capturedPiece)) blackCaptured.push(capturedPiece);
            else whiteCaptured.push(capturedPiece);
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
            const rook = board[startRow][castlingType === 'queenside' ? 0 : 7];
            board[startRow][castlingType === 'queenside' ? 0 : 7] = '';
            board[startRow][castlingType === 'queenside' ? 3 : 5] = rook;
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

        whiteTurn = !whiteTurn;
    }
    
    function promotePawn(row, col, newPiece) {
        const piece = board[row][col];
        board[row][col] = isWhite(piece) ? newPiece.toUpperCase() : newPiece.toLowerCase();
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

    function findKing(isWhiteKing, currentBoard = board) {
        const king = isWhiteKing ? 'K' : 'k';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (currentBoard[row][col] === king) return { row, col };
            }
        }
        return null;
    }

    function isKingInCheck(isWhiteKing, currentBoard = board) {
        const kingPosition = findKing(isWhiteKing, currentBoard);
        if (!kingPosition) return false;
        const opponentPieces = getPieces(!isWhiteKing);
        for (const piece of opponentPieces) {
            if (isValidMove(piece.row, piece.col, kingPosition.row, kingPosition.col, true)) {
                return true;
            }
        }
        return false;
    }
    
    function hasValidMoves(isWhitePlayer) {
        const pieces = getPieces(isWhitePlayer);
        for (const piece of pieces) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (isValidMove(piece.row, piece.col, row, col)) {
                        return true;
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

    function isInsufficientMaterial() {
        const pieces = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c]) pieces.push(board[r][c]);
            }
        }
        if (pieces.length <= 3) {
            const hasMajorPiece = pieces.some(p => p.toLowerCase() === 'q' || p.toLowerCase() === 'r' || p.toLowerCase() === 'p');
            if (!hasMajorPiece) return true;
        }
        const bishops = pieces.filter(p => p.toLowerCase() === 'b');
        if (pieces.length === 4 && bishops.length === 2) {
            let bishop1Pos, bishop2Pos;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    if (board[r][c].toLowerCase() === 'b') {
                        if (!bishop1Pos) bishop1Pos = { r, c };
                        else bishop2Pos = { r, c };
                    }
                }
            }
            if ((bishop1Pos.r + bishop1Pos.c) % 2 === (bishop2Pos.r + bishop2Pos.c) % 2) return true;
        }
        return false;
    }

    function isThreefoldRepetition() {
        const lastBoard = JSON.stringify(board);
        const repetitions = boardHistory.filter(b => b === lastBoard).length;
        return repetitions >= 2;
    }

    function toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece, isCheck, isCheckmate) {
        let notation;
        if (piece.toLowerCase() === 'k' && Math.abs(startCol - endCol) === 2) {
            notation = endCol === 6 ? 'O-O' : 'O-O-O';
        } else {
            const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            const pieceSymbol = piece.toUpperCase() === 'P' ? '' : piece.toUpperCase();
            const captureSymbol = capturedPiece ? 'x' : '';
            notation = `${pieceSymbol}${files[startCol]}${8-startRow}${captureSymbol}${files[endCol]}${8-endRow}`;
        }
        if (isCheckmate) notation += '#';
        else if (isCheck) notation += '+';
        return notation;
    }

    function takeback() {
        if (moveHistory.length > 0) {
            const lastBoard = moveHistory.pop();
            boardHistory.pop();
            board = JSON.parse(JSON.stringify(lastBoard));
            whiteTurn = !whiteTurn;
            // This is a simplified takeback, it does not restore king/rook moved status, etc.
            // For a full implementation, more state would need to be saved in the history.
        }
    }

    return {
        getState,
        setState,
        isWhite,
        isValidMove,
        movePiece,
        promotePawn,
        isCheckmate,
        isStalemate,
        isInsufficientMaterial,
        isThreefoldRepetition,
        toAlgebraic,
        getPieces,
        isKingInCheck,
        findKing,
        pieceUnicode,
        takeback
    };
})();
