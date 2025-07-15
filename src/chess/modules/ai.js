// ai.js

const AI = (() => {
    const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 100 };

    function getBestMove(gameState, difficulty) {
        const legalMoves = getAllLegalMoves(gameState);
        if (legalMoves.length === 0) return null;

        if (difficulty === 'easy') {
            return legalMoves[Math.floor(Math.random() * legalMoves.length)];
        }

        let bestMove = null;
        let bestScore = -Infinity;

        for (const move of legalMoves) {
            const tempState = simulateMove(gameState, move);
            const score = evaluateBoard(tempState, gameState.whiteTurn);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }

    function getAllLegalMoves(gameState) {
        const { board, whiteTurn } = gameState;
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
        return legalMoves;
    }

    function evaluateBoard(gameState, isWhite) {
        let score = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState.board[row][col];
                if (piece) {
                    const value = pieceValues[piece.toLowerCase()];
                    if (Game.isWhite(piece) === isWhite) {
                        score += value;
                    } else {
                        score -= value;
                    }
                }
            }
        }
        return score;
    }

    function simulateMove(gameState, move) {
        const { board } = gameState;
        const newBoard = JSON.parse(JSON.stringify(board));
        const piece = newBoard[move.startRow][move.startCol];
        newBoard[move.endRow][move.endCol] = piece;
        newBoard[move.startRow][move.startCol] = '';
        return { ...gameState, board: newBoard };
    }

    return {
        getBestMove
    };
})();
