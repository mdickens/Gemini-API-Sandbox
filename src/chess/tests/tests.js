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

// --- Pawn Movement Tests ---

runTest("Pawn can move one square forward", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(6, 0, 5, 0) === true, "White pawn should move one square forward");
});

runTest("Pawn can move two squares forward on first move", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(6, 0, 4, 0) === true, "White pawn should move two squares forward on first move");
});

runTest("Pawn cannot move two squares forward after first move", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(5, 0, 3, 0) === false, "White pawn should not move two squares forward after first move");
});

runTest("Pawn can capture diagonally", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'p', '', '', '', '', ''],
        ['', 'P', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(5, 1, 4, 2) === true, "White pawn should capture diagonally");
});

runTest("Pawn cannot move forward if blocked", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', '', '', '', '', '', '', ''],
        ['p', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(6, 0, 5, 0) === false, "White pawn should not move forward if blocked");
});

// --- Rook Movement Tests ---

runTest("Rook can move horizontally", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'R', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(4, 1, 4, 5) === true, "Rook should move horizontally");
});

runTest("Rook can move vertically", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'R', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 1, 6, 1) === true, "Rook should move vertically");
});

runTest("Rook cannot move through pieces", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'R', 'p', 'R', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 1, 2, 3) === false, "Rook should not move through pieces");
});

// --- Bishop Movement Tests ---

runTest("Bishop can move diagonally", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'B', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 2, 5, 5) === true, "Bishop should move diagonally");
});

runTest("Bishop cannot move through pieces", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'B', '', '', '', '', ''],
        ['', '', '', 'p', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 2, 5, 5) === false, "Bishop should not move through pieces");
});

// --- Knight Movement Tests ---

runTest("Knight can move in an L-shape", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'N', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 2, 4, 3) === true, "Knight should move in an L-shape");
});

runTest("Knight can jump over pieces", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'p', 'p', 'p', '', '', '', ''],
        ['', 'p', 'N', 'p', '', '', '', ''],
        ['', 'p', 'p', 'p', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(3, 2, 5, 3) === true, "Knight should jump over pieces");
});

// --- Queen Movement Tests ---

runTest("Queen can move horizontally", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'Q', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(4, 1, 4, 5) === true, "Queen should move horizontally");
});

runTest("Queen can move vertically", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', 'Q', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 1, 6, 1) === true, "Queen should move vertically");
});

runTest("Queen can move diagonally", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'Q', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 2, 5, 5) === true, "Queen should move diagonally");
});

runTest("Queen cannot move through pieces", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', 'Q', '', '', '', '', ''],
        ['', '', '', 'p', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(2, 2, 5, 5) === false, "Queen should not move through pieces");
});

// --- King Movement Tests ---

runTest("King can move one square in any direction", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', 'K', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
    ];
    whiteTurn = true;

    // Test
    assert(isValidMove(3, 3, 2, 2) === true, "King should move one square diagonally");
    assert(isValidMove(3, 3, 4, 4) === true, "King should move one square diagonally");
    assert(isValidMove(3, 3, 2, 3) === true, "King should move one square vertically");
    assert(isValidMove(3, 3, 4, 3) === true, "King should move one square vertically");
    assert(isValidMove(3, 3, 3, 2) === true, "King should move one square horizontally");
    assert(isValidMove(3, 3, 3, 4) === true, "King should move one square horizontally");
});