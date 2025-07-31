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
                ['', '', '', 'r', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: true
        });
        assert.ok(Game.isKingInCheck(true), "White king should be in check");
    });

    QUnit.test("White is in checkmate", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['k', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['R', '', '', '', '', '', '', ''],
                ['R', '', '', '', '', '', '', ''],
                ['K', '', '', '', '', '', '', ''],
            ],
            whiteTurn: false
        });
        assert.ok(Game.isCheckmate(false), "White is in checkmate");
    });

    QUnit.test("Black king is in check", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', 'k', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', 'R', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'K', '', '', ''],
            ],
            whiteTurn: false
        });
        assert.ok(Game.isKingInCheck(false), "Black king should be in check");
    });

    QUnit.test("Black is in checkmate", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['k', '', '', '', '', '', '', ''],
                ['', '', '', '', '', 'R', '', ''],
                ['', '', '', '', '', 'R', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['K', '', '', '', '', '', '', ''],
            ],
            whiteTurn: false
        });
        assert.ok(Game.isCheckmate(false), "Black is in checkmate");
    });
});
