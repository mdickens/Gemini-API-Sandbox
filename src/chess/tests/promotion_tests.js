QUnit.module('Pawn Promotion', hooks => {
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

    QUnit.test("White pawn can be promoted", function(assert) {
        Game.setState({
            ...Game.getState(),
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
        Game.movePiece(1, 0, 0, 0);
        Game.promotePawn(0, 0, 'Q');
        assert.equal(Game.getState().board[0][0], 'Q', "White pawn should be promoted to a queen");
    });

    QUnit.test("Black pawn can be promoted", function(assert) {
        Game.setState({
            ...Game.getState(),
            board: [
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', '', '', '', ''],
                ['', '', '', '', 'p', '', '', ''],
                ['', '', '', '', '', '', '', ''],
            ],
            whiteTurn: false
        });
        Game.movePiece(6, 4, 7, 4);
        Game.promotePawn(7, 4, 'q');
        assert.equal(Game.getState().board[7][4], 'q', "Black pawn should be promoted to a queen");
    });
});