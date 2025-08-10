QUnit.module('Pawn Movement', hooks => {
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

    QUnit.test("Pawn can move one square forward", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(6, 0, 5, 0), "White pawn should move one square forward");
    });

    QUnit.test("Pawn can move two squares forward on first move", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(6, 0, 4, 0), "White pawn should move two squares forward on first move");
    });

    QUnit.test("Pawn cannot move two squares forward after first move", function(assert) {
        Game.setState({
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
        assert.notOk(Game.isValidMove(5, 0, 3, 0), "White pawn should not move two squares forward after first move");
    });

    QUnit.test("Pawn can capture diagonally", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(5, 1, 4, 2), "White pawn should capture diagonally");
    });

    QUnit.test("Pawn cannot move forward if blocked", function(assert) {
        Game.setState({
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
        assert.notOk(Game.isValidMove(6, 0, 5, 0), "White pawn should not move forward if blocked");
    });

    QUnit.test("White pawn cannot jump over its own piece", function(assert) {
        Game.setState({
            board: [
                ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'B', '', '', ''],
                ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ],
            whiteTurn: true,
        });
        assert.notOk(Game.isValidMove(6, 4, 4, 4), "White pawn should not jump over its own bishop");
    });

    QUnit.test("Black pawn cannot jump over its own piece", function(assert) {
        Game.setState({
            board: [
                ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
                ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                ['', '', '', '', 'b', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ],
            whiteTurn: false,
        });
        assert.notOk(Game.isValidMove(1, 4, 3, 4), "Black pawn should not jump over its own bishop");
    });
});

QUnit.module('Rook Movement', hooks => {
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

    QUnit.test("Rook can move horizontally", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(4, 1, 4, 5), "Rook should move horizontally");
    });

    QUnit.test("Rook can move vertically", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(2, 1, 6, 1), "Rook should move vertically");
    });

    QUnit.test("Rook cannot move through pieces", function(assert) {
        Game.setState({
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
        assert.notOk(Game.isValidMove(2, 1, 2, 3), "Rook should not move through pieces");
    });
});

QUnit.module('Knight Movement', hooks => {
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

    QUnit.test("Knight can move in an L-shape", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(2, 2, 4, 3), "Knight should move in an L-shape");
    });

    QUnit.test("Knight can jump over pieces", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(3, 2, 5, 3), "Knight should jump over pieces");
    });
});

QUnit.module('Bishop Movement', hooks => {
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

    QUnit.test("Bishop can move diagonally", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(2, 2, 5, 5), "Bishop should move diagonally");
    });

    QUnit.test("Bishop cannot move through pieces", function(assert) {
        Game.setState({
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
        assert.notOk(Game.isValidMove(2, 2, 5, 5), "Bishop should not move through pieces");
    });
});

QUnit.module('Queen Movement', hooks => {
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

    QUnit.test("Queen can move horizontally", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(4, 1, 4, 5), "Queen should move horizontally");
    });

    QUnit.test("Queen can move vertically", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(2, 1, 6, 1), "Queen should move vertically");
    });

    QUnit.test("Queen can move diagonally", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(2, 2, 5, 5), "Queen should move diagonally");
    });

    QUnit.test("Queen cannot move through pieces", function(assert) {
        Game.setState({
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
        assert.notOk(Game.isValidMove(2, 2, 5, 5), "Queen should not move through pieces");
    });
});

QUnit.module('King Movement', hooks => {
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

    QUnit.test("King can move one square in any direction", function(assert) {
        Game.setState({
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
        assert.ok(Game.isValidMove(3, 3, 2, 2), "King should move one square diagonally");
        assert.ok(Game.isValidMove(3, 3, 4, 4), "King should move one square diagonally");
        assert.ok(Game.isValidMove(3, 3, 2, 3), "King should move one square vertically");
        assert.ok(Game.isValidMove(3, 3, 4, 3), "King should move one square vertically");
        assert.ok(Game.isValidMove(3, 3, 3, 2), "King should move one square horizontally");
        assert.ok(Game.isValidMove(3, 3, 3, 4), "King should move one square horizontally");
    });
});

QUnit.module('Game State', hooks => {
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

    QUnit.test("Takeback does not cause incorrect threefold repetition", function(assert) {
        // e2e3
        Game.movePiece(6, 4, 5, 4);
        // takeback
        Game.takeback();
        // e2e3
        Game.movePiece(6, 4, 5, 4);
        // takeback
        Game.takeback();
        // e2e3
        Game.movePiece(6, 4, 5, 4);

        assert.notOk(Game.isThreefoldRepetition(), "Game should not be a draw by threefold repetition");
    });
});