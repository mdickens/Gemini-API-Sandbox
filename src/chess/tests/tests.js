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


// --- Pawn Movement Tests ---

runTest("Pawn can move one square forward", () => {
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
});

runTest("Pawn can move two squares forward on first move", () => {
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
});

runTest("Pawn cannot move two squares forward after first move", () => {
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
});

runTest("Pawn can capture diagonally", () => {
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
});

runTest("Pawn cannot move forward if blocked", () => {
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
});

// --- Rook Movement Tests ---

runTest("Rook can move horizontally", () => {
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
});

runTest("Rook can move vertically", () => {
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
});

runTest("Rook cannot move through pieces", () => {
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
});

// --- Bishop Movement Tests ---

runTest("Bishop can move diagonally", () => {
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
});

runTest("Bishop cannot move through pieces", () => {
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
});

// --- Knight Movement Tests ---

runTest("Knight can move in an L-shape", () => {
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
});

runTest("Knight can jump over pieces", () => {
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
});

// --- Queen Movement Tests ---

runTest("Queen can move horizontally", () => {
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
});

runTest("Queen can move vertically", () => {
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
});

runTest("Queen can move diagonally", () => {
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
});

runTest("Queen cannot move through pieces", () => {
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
});

// --- King Movement Tests ---

runTest("King can move one square in any direction", () => {
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
});
