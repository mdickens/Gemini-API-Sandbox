QUnit.module('Layout', hooks => {
    QUnit.test("Elements should not overlap", function(assert) {
        const whiteTimerBox = document.getElementById('white-timer-box');
        const newGameButton = document.getElementById('new-game-button');
        const flipBoardButton = document.getElementById('flip-board-button');

        const whiteTimerBoxRect = whiteTimerBox.getBoundingClientRect();
        const newGameButtonRect = newGameButton.getBoundingClientRect();
        const flipBoardButtonRect = flipBoardButton.getBoundingClientRect();

        const overlapWithNewGame = !(whiteTimerBoxRect.right < newGameButtonRect.left || 
                                     whiteTimerBoxRect.left > newGameButtonRect.right || 
                                     whiteTimerBoxRect.bottom < newGameButtonRect.top || 
                                     whiteTimerBoxRect.top > newGameButtonRect.bottom);

        const overlapWithFlipBoard = !(whiteTimerBoxRect.right < flipBoardButtonRect.left || 
                                       whiteTimerBoxRect.left > flipBoardButtonRect.right || 
                                       whiteTimerBoxRect.bottom < flipBoardButtonRect.top || 
                                       whiteTimerBoxRect.top > flipBoardButtonRect.bottom);

        assert.notOk(overlapWithNewGame, "White timer box should not overlap with New Game button");
        assert.notOk(overlapWithFlipBoard, "White timer box should not overlap with Flip Board button");
    });
});
