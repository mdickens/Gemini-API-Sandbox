QUnit.module('Resign', hooks => {
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

    QUnit.test("Resign button ends the game", function(assert) {
        const done = assert.async();
        const resignButton = document.getElementById('resign-button');
        resignButton.click();

        setTimeout(() => {
            const confirmYesButton = document.getElementById('confirm-yes');
            confirmYesButton.click();

            setTimeout(() => {
                const gameOverModal = document.getElementById('game-over-modal');
                const gameOverMessage = document.getElementById('game-over-message');
                assert.equal(gameOverModal.style.display, 'flex', "Game over modal should be displayed");
                assert.ok(gameOverMessage.textContent.includes('resigned'), "Game over message should indicate resignation");
                done();
            }, 500);
        }, 500);
    });
});
