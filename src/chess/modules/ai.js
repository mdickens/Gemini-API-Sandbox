// ai.js

const AI = (() => {
    const pieceValues = { 'p': 100, 'n': 320, 'b': 330, 'r': 500, 'q': 900, 'k': 20000 };

    // Piece-Square Tables for positional evaluation
    const pawnTable = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5,  5, 10, 25, 25, 10,  5,  5],
        [0,  0,  0, 20, 20,  0,  0,  0],
        [5, -5,-10,  0,  0,-10, -5,  5],
        [5, 10, 10,-20,-20, 10, 10,  5],
        [0,  0,  0,  0,  0,  0,  0,  0]
    ];

    const knightTable = [
        [-50,-40,-30,-30,-30,-30,-40,-50],
        [-40,-20,  0,  0,  0,  0,-20,-40],
        [-30,  0, 10, 15, 15, 10,  0,-30],
        [-30,  5, 15, 20, 20, 15,  5,-30],
        [-30,  0, 15, 20, 20, 15,  0,-30],
        [-30,  5, 10, 15, 15, 10,  5,-30],
        [-40,-20,  0,  5,  5,  0,-20,-40],
        [-50,-40,-30,-30,-30,-30,-40,-50]
    ];

    const bishopTable = [
        [-20,-10,-10,-10,-10,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5, 10, 10,  5,  0,-10],
        [-10,  5,  5, 10, 10,  5,  5,-10],
        [-10,  0, 10, 10, 10, 10,  0,-10],
        [-10, 10, 10, 10, 10, 10, 10,-10],
        [-10,  5,  0,  0,  0,  0,  5,-10],
        [-20,-10,-10,-10,-10,-10,-10,-20]
    ];

    const rookTable = [
        [0,  0,  0,  0,  0,  0,  0,  0],
        [5, 10, 10, 10, 10, 10, 10,  5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [-5,  0,  0,  0,  0,  0,  0, -5],
        [0,  0,  0,  5,  5,  0,  0,  0]
    ];

    const queenTable = [
        [-20,-10,-10, -5, -5,-10,-10,-20],
        [-10,  0,  0,  0,  0,  0,  0,-10],
        [-10,  0,  5,  5,  5,  5,  0,-10],
        [-5,  0,  5,  5,  5,  5,  0, -5],
        [0,  0,  5,  5,  5,  5,  0, -5],
        [-10,  5,  5,  5,  5,  5,  0,-10],
        [-10,  0,  5,  0,  0,  0,  0,-10],
        [-20,-10,-10, -5, -5,-10,-10,-20]
    ];

    const kingTable = [
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-30,-40,-40,-50,-50,-40,-40,-30],
        [-20,-30,-30,-40,-40,-30,-30,-20],
        [-10,-20,-20,-20,-20,-20,-20,-10],
        [ 20, 20,  0,  0,  0,  0, 20, 20],
        [ 20, 30, 10,  0,  0, 10, 30, 20]
    ];

    function getBestMove(gameState, difficulty) {
        const depth = { 'easy': 1, 'medium': 2, 'hard': 3 }[difficulty];
        const legalMoves = getAllLegalMoves(gameState);
        if (legalMoves.length === 0) return null;

        let bestMove = legalMoves[0];
        const isWhitePlayer = gameState.whiteTurn;
        let bestValue = isWhitePlayer ? -Infinity : Infinity;

        for (const move of legalMoves) {
            const tempState = simulateMove(gameState, move);
            const boardValue = minimax(tempState, depth - 1, -Infinity, Infinity, !isWhitePlayer);

            if (isWhitePlayer) {
                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            } else { // Black's turn (minimizing player)
                if (boardValue < bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }

    function minimax(gameState, depth, alpha, beta, isMaximizingPlayer) {
        if (depth === 0) {
            return evaluateBoard(gameState.board);
        }

        const legalMoves = getAllLegalMoves(gameState);
        if (legalMoves.length === 0) {
            const originalState = Game.getState();
            Game.setState(gameState);
            const isCheck = Game.isKingInCheck(gameState.whiteTurn);
            Game.setState(originalState);
            if (isCheck) return isMaximizingPlayer ? -Infinity : Infinity; // Checkmate
            return 0; // Stalemate
        }

        if (isMaximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of legalMoves) {
                const tempState = simulateMove(gameState, move);
                const evaluation = minimax(tempState, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of legalMoves) {
                const tempState = simulateMove(gameState, move);
                const evaluation = minimax(tempState, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    function evaluateBoard(board) {
        let totalEvaluation = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()];
                    const positionalValue = getPositionalValue(piece, row, col);
                    totalEvaluation += Game.isWhite(piece) ? (value + positionalValue) : -(value + positionalValue);
                }
            }
        }
        return totalEvaluation;
    }

    function getPositionalValue(piece, row, col) {
        const pieceType = piece.toLowerCase();
        const table = {
            'p': pawnTable,
            'n': knightTable,
            'b': bishopTable,
            'r': rookTable,
            'q': queenTable,
            'k': kingTable
        }[pieceType];

        if (!table) return 0;
        return Game.isWhite(piece) ? table[row][col] : table[7 - row][col];
    }

    function getAllLegalMoves(gameState) {
        const originalState = Game.getState();
        Game.setState(gameState);

        const { whiteTurn } = gameState;
        const legalMoves = [];
        const pieces = Game.getPieces(whiteTurn);
        for (const piece of pieces) {
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    if (Game.isValidMove(piece.row, piece.col, row, col)) {
                        legalMoves.push({ startRow: piece.row, startCol: piece.col, endRow: row, endCol: col });
                    }
                }
            }
        }

        Game.setState(originalState);
        return legalMoves;
    }

    function simulateMove(gameState, move) {
        const newBoard = JSON.parse(JSON.stringify(gameState.board));
        const piece = newBoard[move.startRow][move.startCol];
        newBoard[move.endRow][move.endCol] = piece;
        newBoard[move.startRow][move.startCol] = '';
        return { ...gameState, board: newBoard, whiteTurn: !gameState.whiteTurn };
    }

    return {
        getBestMove
    };
})();
