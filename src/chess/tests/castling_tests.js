QUnit.module('Castling', hooks => {
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

    QUnit.test("White can castle kingside", function(assert) {
        Game.setState({
            ...Game.getState(),
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
            whiteKingMoved: false,
            whiteRooksMoved: [false, false]
        });
        assert.ok(Game.isValidMove(7, 4, 7, 6), "White should be able to castle kingside");
    });

    QUnit.test("White can castle queenside", function(assert) {
        Game.setState({
            ...Game.getState(),
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
            whiteKingMoved: false,
            whiteRooksMoved: [false, false]
        });
        assert.ok(Game.isValidMove(7, 4, 7, 2), "White should be able to castle queenside");
    });

    QUnit.test("White cannot castle if king has moved", function(assert) {
        Game.setState({
            ...Game.getState(),
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
            whiteKingMoved: true,
            whiteRooksMoved: [false, false]
        });
        assert.notOk(Game.isValidMove(7, 4, 7, 6), "White should not be able to castle if king has moved");
    });

    QUnit.test("White cannot castle if rook has moved", function(assert) {
        Game.setState({
            ...Game.getState(),
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
            whiteKingMoved: false,
            whiteRooksMoved: [true, false]
        });
        assert.notOk(Game.isValidMove(7, 4, 7, 2), "White should not be able to castle if rook has moved");
    });

    QUnit.test("White cannot castle through check", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', 'k', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'r', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['R', '', '', '', 'K', '', '', 'R'],
            ],
            whiteTurn: true,
            whiteKingMoved: false,
            whiteRooksMoved: [false, false]
        });
        assert.notOk(Game.isValidMove(7, 4, 7, 6), "White should not be able to castle through check");
    });
});
