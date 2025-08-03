QUnit.module('Check and Checkmate', hooks => {
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

    QUnit.test("White king is in check", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', 'k', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'r', '', '', ''], // Black rook checks White king
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: true
        });
        assert.ok(Game.isKingInCheck(true), "White king should be in check");
    });

    QUnit.test("White is in checkmate (Anastasia's mate) fixed", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', 'R', '', 'K'],
                ['', '', '', '', 'n', 'P', 'P', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', 'r'],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'k', '', '', ''],
            ],
            whiteTurn: true
        });
        assert.ok(Game.isCheckmate(true), "White should be in checkmate");
    });

    QUnit.test("Black king is in check", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', 'k', '', '', ''],
                ['', '', '', '', 'R', '', '', ''], // White rook checks Black king
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: false
        });
        assert.ok(Game.isKingInCheck(false), "Black king should be in check");
    });

    QUnit.test("Black is in checkmate (back-rank mate)", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['R', '', '', '', 'k', '', '', ''],
                ['', 'R', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: false
        });
        assert.ok(Game.isCheckmate(false), "Black should be in checkmate");
    });
});
