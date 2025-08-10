QUnit.module('En Passant', hooks => {
    hooks.beforeEach(function() {
        Game.setState({
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
        });
    });

    // White to Capture
    QUnit.test("White can capture en passant - 1", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['P', 'p', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 1, endRow: 3, endCol: 1 }
        });
        assert.ok(Game.isValidMove(3, 0, 2, 1), "White pawn can capture en passant on B5");
    });

    QUnit.test("White can capture en passant - 2", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['p', 'P', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 0, endRow: 3, endCol: 0 }
        });
        assert.ok(Game.isValidMove(3, 1, 2, 0), "White pawn can capture en passant on A5");
    });

    QUnit.test("White can capture en passant - 3", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', 'P', 'p', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 2, endRow: 3, endCol: 2 }
        });
        assert.ok(Game.isValidMove(3, 1, 2, 2), "White pawn can capture en passant on C5");
    });

    QUnit.test("White can capture en passant - 4", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', 'p', 'P', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 1, endRow: 3, endCol: 1 }
        });
        assert.ok(Game.isValidMove(3, 2, 2, 1), "White pawn can capture en passant on B5");
    });

    QUnit.test("White can capture en passant - 5", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', 'P', 'p', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 3, endRow: 3, endCol: 3 }
        });
        assert.ok(Game.isValidMove(3, 2, 2, 3), "White pawn can capture en passant on D5");
    });

    QUnit.test("White can capture en passant - 6", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', 'p', 'P', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 2, endRow: 3, endCol: 2 }
        });
        assert.ok(Game.isValidMove(3, 3, 2, 2), "White pawn can capture en passant on C5");
    });

    QUnit.test("White can capture en passant - 7", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'P', 'p', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 4, endRow: 3, endCol: 4 }
        });
        assert.ok(Game.isValidMove(3, 3, 2, 4), "White pawn can capture en passant on E5");
    });

    QUnit.test("White can capture en passant - 8", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'p', 'P', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 3, endRow: 3, endCol: 3 }
        });
        assert.ok(Game.isValidMove(3, 4, 2, 3), "White pawn can capture en passant on D5");
    });

    QUnit.test("White can capture en passant - 9", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'P', 'p', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 5, endRow: 3, endCol: 5 }
        });
        assert.ok(Game.isValidMove(3, 4, 2, 5), "White pawn can capture en passant on F5");
    });

    QUnit.test("White can capture en passant - 10", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'p', 'P', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 4, endRow: 3, endCol: 4 }
        });
        assert.ok(Game.isValidMove(3, 5, 2, 4), "White pawn can capture en passant on E5");
    });

    QUnit.test("White can capture en passant - 11", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'P', 'p', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 6, endRow: 3, endCol: 6 }
        });
        assert.ok(Game.isValidMove(3, 5, 2, 6), "White pawn can capture en passant on G5");
    });

    QUnit.test("White can capture en passant - 12", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'p', 'P', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 5, endRow: 3, endCol: 5 }
        });
        assert.ok(Game.isValidMove(3, 6, 2, 5), "White pawn can capture en passant on F5");
    });

    QUnit.test("White can capture en passant - 13", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', 'P', 'p'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 7, endRow: 3, endCol: 7 }
        });
        assert.ok(Game.isValidMove(3, 6, 2, 7), "White pawn can capture en passant on H5");
    });

    QUnit.test("White can capture en passant - 14", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', 'p', 'P'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: true,
            lastMove: { piece: 'p', startRow: 1, startCol: 6, endRow: 3, endCol: 6 }
        });
        assert.ok(Game.isValidMove(3, 7, 2, 6), "White pawn can capture en passant on G5");
    });

    // Black to Capture
    QUnit.test("Black can capture en passant - 15", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['p', 'P', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 1, endRow: 4, endCol: 1 }
        });
        assert.ok(Game.isValidMove(4, 0, 5, 1), "Black pawn can capture en passant on B4");
    });

    QUnit.test("Black can capture en passant - 16", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['P', 'p', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 0, endRow: 4, endCol: 0 }
        });
        assert.ok(Game.isValidMove(4, 1, 5, 0), "Black pawn can capture en passant on A4");
    });

    QUnit.test("Black can capture en passant - 17", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', 'p', 'P', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 2, endRow: 4, endCol: 2 }
        });
        assert.ok(Game.isValidMove(4, 1, 5, 2), "Black pawn can capture en passant on C4");
    });

    QUnit.test("Black can capture en passant - 18", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', 'P', 'p', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 1, endRow: 4, endCol: 1 }
        });
        assert.ok(Game.isValidMove(4, 2, 5, 1), "Black pawn can capture en passant on B4");
    });

    QUnit.test("Black can capture en passant - 19", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', 'p', 'P', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 3, endRow: 4, endCol: 3 }
        });
        assert.ok(Game.isValidMove(4, 2, 5, 3), "Black pawn can capture en passant on D4");
    });

    QUnit.test("Black can capture en passant - 20", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', 'P', 'p', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 2, endRow: 4, endCol: 2 }
        });
        assert.ok(Game.isValidMove(4, 3, 5, 2), "Black pawn can capture en passant on C4");
    });

    QUnit.test("Black can capture en passant - 21", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'p', 'P', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 4, endRow: 4, endCol: 4 }
        });
        assert.ok(Game.isValidMove(4, 3, 5, 4), "Black pawn can capture en passant on E4");
    });

    QUnit.test("Black can capture en passant - 22", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'P', 'p', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 3, endRow: 4, endCol: 3 }
        });
        assert.ok(Game.isValidMove(4, 4, 5, 3), "Black pawn can capture en passant on D4");
    });

    QUnit.test("Black can capture en passant - 23", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'p', 'P', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 5, endRow: 4, endCol: 5 }
        });
        assert.ok(Game.isValidMove(4, 4, 5, 5), "Black pawn can capture en passant on F4");
    });

    QUnit.test("Black can capture en passant - 24", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'P', 'p', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 4, endRow: 4, endCol: 4 }
        });
        assert.ok(Game.isValidMove(4, 5, 5, 4), "Black pawn can capture en passant on E4");
    });

    QUnit.test("Black can capture en passant - 25", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'p', 'P', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 6, endRow: 4, endCol: 6 }
        });
        assert.ok(Game.isValidMove(4, 5, 5, 6), "Black pawn can capture en passant on G4");
    });

    QUnit.test("Black can capture en passant - 26", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'P', 'p', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 5, endRow: 4, endCol: 5 }
        });
        assert.ok(Game.isValidMove(4, 6, 5, 5), "Black pawn can capture en passant on F4");
    });

    QUnit.test("Black can capture en passant - 27", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', 'p', 'P'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 7, endRow: 4, endCol: 7 }
        });
        assert.ok(Game.isValidMove(4, 6, 5, 7), "Black pawn can capture en passant on H4");
    });

    QUnit.test("Black can capture en passant - 28", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', 'P', 'p'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', '']
            ],
            whiteTurn: false,
            lastMove: { piece: 'P', startRow: 6, startCol: 6, endRow: 4, endCol: 6 }
        });
        assert.ok(Game.isValidMove(4, 7, 5, 6), "Black pawn can capture en passant on G4");
    });
});
