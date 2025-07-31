
QUnit.module('Player vs. Player', hooks => {
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
        UI.createBoard(Game.getState());
    });

    QUnit.test('Black piece cannot move first', function(assert) {
        const done = assert.async();
        
        const fromRow = 1;
        const fromCol = 4;
        const toRow = 2;
        const toCol = 4;

        const fromSquare = chessboard.querySelector(`[data-row='${fromRow}'][data-col='${fromCol}']`);
        const toSquare = chessboard.querySelector(`[data-row='${toRow}'][data-col='${toCol}']`);

        console.log('Before move:', JSON.stringify(Game.getState().board));

        const handleSquareClick = window.handleSquareClick;

        handleSquareClick({ target: fromSquare });
        handleSquareClick({ target: toSquare });

        setTimeout(() => {
            console.log('After move:', JSON.stringify(Game.getState().board));
            const pieceAtFrom = Game.getState().board[fromRow][fromCol];
            const pieceAtTo = Game.getState().board[toRow][toCol];

            assert.ok(pieceAtFrom, 'Piece should still be at e7');
            assert.equal(pieceAtFrom, 'p', 'Piece at e7 is still a black pawn');
            assert.notOk(pieceAtTo, 'No piece should be at e6');
            
            done();
        }, 500);
    });
});
