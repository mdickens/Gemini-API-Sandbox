runTest("King can castle kingside", () => {
    // Setup
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', '', '', 'R'],
    ];
    whiteTurn = true;
    whiteKingMoved = false;
    whiteRooksMoved = [false, false];

    // Test
    assert(isValidMove(7, 4, 7, 6) === true, "King should be able to castle kingside");
});

runTest("King can castle queenside", () => {
    // Setup
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', '', '', '', 'K', 'B', 'N', 'R'],
    ];
    whiteTurn = true;
    whiteKingMoved = false;
    whiteRooksMoved = [false, false];

    // Test
    assert(isValidMove(7, 4, 7, 2) === true, "King should be able to castle queenside");
});

runTest("King cannot castle if moved", () => {
    // Setup
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', '', '', 'R'],
    ];
    whiteTurn = true;
    whiteKingMoved = true;
    whiteRooksMoved = [false, false];

    // Test
    assert(isValidMove(7, 4, 7, 6) === false, "King should not be able to castle if moved");
});

runTest("King cannot castle if rook moved", () => {
    // Setup
    board = [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', '', '', 'R'],
    ];
    whiteTurn = true;
    whiteKingMoved = false;
    whiteRooksMoved = [false, true];

    // Test
    assert(isValidMove(7, 4, 7, 6) === false, "King should not be able to castle if rook moved");
});

runTest("King cannot castle through check", () => {
    // Setup
    board = [
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', 'r', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', '', '', 'R'],
    ];
    whiteTurn = true;
    whiteKingMoved = false;
    whiteRooksMoved = [false, false];

    // Test
    assert(isValidMove(7, 4, 7, 6) === false, "King should not be able to castle through check");
});
