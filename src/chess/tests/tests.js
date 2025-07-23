const testResults = document.getElementById('test-results');

function runTest(name, testFunction) {
    try {
        testFunction();
        testResults.innerHTML += `<p style="color: green;">[PASS] ${name}</p>`;
    } catch (error) {
        testResults.innerHTML += `<p style="color: red;">[FAIL] ${name}: ${error.message}</p>`;
        console.error(error);
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

function setupTest(config) {
    const initialState = {
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ],
        whiteTurn: true,
        whiteKingMoved: false,
        blackKingMoved: false,
        whiteRooksMoved: [false, false],
        blackRooksMoved: [false, false],
        fiftyMoveRuleCounter: 0,
        lastMove: null,
        moveHistory: [],
        boardHistory: [],
        whiteCaptured: [],
        blackCaptured: []
    };
    Game.setState({ ...initialState, ...config });
}

let originalUI;
let pgnMoves = [];
let moveNumber = 1;

function handleMove(startRow, startCol, endRow, endCol) {
    const piece = Game.getState().board[startRow][startCol];
    const capturedPiece = Game.getState().board[endRow][endCol];
    const wasWhiteTurn = Game.getState().whiteTurn;

    UI.animateMove(startRow, startCol, endRow, endCol, () => {
        Game.movePiece(startRow, startCol, endRow, endCol);
        
        if (capturedPiece) UI.playSound('capture');
        else UI.playSound('move');

        const state = Game.getState();
        const isCheck = Game.isKingInCheck(state.whiteTurn);
        const isCheckmate = Game.isCheckmate(state.whiteTurn);
        const moveNotation = Game.toAlgebraic(piece, startRow, startCol, endRow, endCol, capturedPiece, isCheck, isCheckmate);
        
        if (wasWhiteTurn) {
            pgnMoves.push(`${moveNumber}. ${moveNotation}`);
        } else {
            pgnMoves[pgnMoves.length - 1] += ` ${moveNotation}`;
        }

        UI.updateMoveHistory(moveNumber, moveNotation, wasWhiteTurn);
        if (!wasWhiteTurn) {
            moveNumber++;
        }

        if (piece.toLowerCase() === 'p' && (endRow === 0 || endRow === 7)) {
            const isWhite = Game.isWhite(piece);
            UI.showPromotionChoices(endRow, endCol, isWhite, (newPiece) => {
                Game.promotePawn(endRow, endCol, newPiece);
                finishMove();
            });
        } else {
            finishMove();
        }
    });
}

function finishMove() {
    // This is a simplified version for testing, we don't need to update the UI
}

function checkAIMove() {
    // This is a simplified version for testing, we don't need to check for AI moves
}

function beforeEach() {
    originalUI = { ...UI };
    UI.animateMove = (startRow, startCol, endRow, endCol, callback) => callback();
    UI.playSound = () => {};
    UI.updateMoveHistory = () => {};
    // Immediately invoke promotion callback with a Queen for testing purposes
    UI.showPromotionChoices = (endRow, endCol, isWhite, callback) => {
        callback('q');
    };
    UI.createBoard = () => {};
    UI.updateStatus = () => {};
    UI.updateTimers = () => {};
    pgnMoves = [];
    moveNumber = 1;
}

function afterEach() {
    UI = originalUI;
}


// --- Pawn Movement Tests ---

runTest("Pawn can move one square forward", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(6, 0, 5, 0) === true, "White pawn should move one square forward");
    afterEach();
});

runTest("Pawn can move two squares forward on first move", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(6, 0, 4, 0) === true, "White pawn should move two squares forward on first move");
    afterEach();
});

runTest("Pawn cannot move two squares forward after first move", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    // Manually set piece on non-start rank
    const state = Game.getState();
    state.board[5][0] = 'P';
    state.board[6][0] = '';
    Game.setState(state);
    assert(Game.isValidMove(5, 0, 3, 0) === false, "White pawn should not move two squares forward after first move");
    afterEach();
});

runTest("Pawn can capture diagonally", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'p', '', '', '', '', ''],
            ['', 'P', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(5, 1, 4, 2) === true, "White pawn should capture diagonally");
    afterEach();
});

runTest("Pawn cannot move forward if blocked", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['p', '', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(6, 0, 5, 0) === false, "White pawn should not move forward if blocked");
    afterEach();
});

// --- Rook Movement Tests ---

runTest("Rook can move horizontally", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'R', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(4, 1, 4, 5) === true, "Rook should move horizontally");
    afterEach();
});

runTest("Rook can move vertically", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'R', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 1, 6, 1) === true, "Rook should move vertically");
    afterEach();
});

runTest("Rook cannot move through pieces", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'R', 'p', 'R', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 1, 2, 3) === false, "Rook should not move through pieces");
    afterEach();
});

// --- Bishop Movement Tests ---

runTest("Bishop can move diagonally", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'B', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 2, 5, 5) === true, "Bishop should move diagonally");
    afterEach();
});

runTest("Bishop cannot move through pieces", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'B', '', '', '', '', ''],
            ['', '', '', 'p', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 2, 5, 5) === false, "Bishop should not move through pieces");
    afterEach();
});

// --- Knight Movement Tests ---

runTest("Knight can move in an L-shape", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'N', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 2, 4, 3) === true, "Knight should move in an L-shape");
    afterEach();
});

runTest("Knight can jump over pieces", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'p', 'p', 'p', '', '', '', ''],
            ['', 'p', 'N', 'p', '', '', '', ''],
            ['', 'p', 'p', 'p', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(3, 2, 5, 3) === true, "Knight should jump over pieces");
    afterEach();
});

// --- Queen Movement Tests ---

runTest("Queen can move horizontally", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'Q', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(4, 1, 4, 5) === true, "Queen should move horizontally");
    afterEach();
});

runTest("Queen can move vertically", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'Q', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 1, 6, 1) === true, "Queen should move vertically");
    afterEach();
});

runTest("Queen can move diagonally", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'Q', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 2, 5, 5) === true, "Queen should move diagonally");
    afterEach();
});

runTest("Queen cannot move through pieces", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', 'Q', '', '', '', '', ''],
            ['', '', '', 'p', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(2, 2, 5, 5) === false, "Queen should not move through pieces");
    afterEach();
});

// --- King Movement Tests ---

runTest("King can move one square in any direction", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', 'K', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    assert(Game.isValidMove(3, 3, 2, 2) === true, "King should move one square diagonally");
    assert(Game.isValidMove(3, 3, 4, 4) === true, "King should move one square diagonally");
    assert(Game.isValidMove(3, 3, 2, 3) === true, "King should move one square vertically");
    assert(Game.isValidMove(3, 3, 4, 3) === true, "King should move one square vertically");
    assert(Game.isValidMove(3, 3, 3, 2) === true, "King should move one square horizontally");
    assert(Game.isValidMove(3, 3, 3, 4) === true, "King should move one square horizontally");
    afterEach();
});

// --- Turn Management Tests ---

runTest("Turn should switch after a valid move", () => {
    beforeEach();
    setupTest(); // Standard starting position
    handleMove(6, 4, 4, 4); // White moves e2 to e4
    const state = Game.getState();
    assert(state.whiteTurn === false, "It should be Black's turn after White moves.");
    afterEach();
});

runTest("Should not be able to move into check", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', 'k', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'R', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', 'K', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: false
    });
    assert(Game.isValidMove(0, 4, 0, 5) === true, "King should be able to move out of the way.");
    assert(Game.isValidMove(0, 4, 1, 4) === false, "King should not be able to move into check.");
    afterEach();
});

runTest("Pawn should be promoted", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: true
    });
    handleMove(1, 0, 0, 0);
    const state = Game.getState();
    assert(state.board[0][0] === 'Q', "Pawn should be promoted to a Queen.");
    afterEach();
});

// --- Castling Tests ---

runTest("Should be able to castle kingside", () => {
    beforeEach();
    setupTest({
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', '', '', '', 'K', '', '', 'R'],
        ],
        whiteTurn: true
    });
    handleMove(7, 4, 7, 6);
    const state = Game.getState();
    assert(state.board[7][6] === 'K' && state.board[7][5] === 'R', "Should be able to castle kingside.");
    afterEach();
});

runTest("Should be able to castle queenside", () => {
    beforeEach();
    setupTest({
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', '', '', '', 'K', '', '', 'R'],
        ],
        whiteTurn: true
    });
    handleMove(7, 4, 7, 2);
    const state = Game.getState();
    assert(state.board[7][2] === 'K' && state.board[7][3] === 'R', "Should be able to castle queenside.");
    afterEach();
});

runTest("Should not be able to castle if king has moved", () => {
    beforeEach();
    setupTest({
        board: [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', '', '', '', 'K', '', '', 'R'],
        ],
        whiteTurn: true,
        whiteKingMoved: true
    });
    assert(Game.isValidMove(7, 4, 7, 6) === false, "Should not be able to castle if king has moved.");
    afterEach();
});

// --- En Passant Tests ---

runTest("Should be able to perform en passant", () => {
    beforeEach();
    setupTest({
        board: [
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', 'p', '', '', '', '', '', ''],
            ['P', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
        ],
        whiteTurn: false,
        lastMove: { piece: 'P', startRow: 6, startCol: 0, endRow: 4, endCol: 0 }
    });
    handleMove(3, 1, 4, 0);
    const state = Game.getState();
    assert(state.board[4][0] === 'p' && state.board[3][0] === '', "Should be able to perform en passant.");
    afterEach();
});
