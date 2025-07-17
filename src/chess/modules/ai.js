// ai.js

const AI = (() => {
    let worker;

    function init() {
        // Create a new worker
        worker = new Worker('modules/ai.worker.js');
    }

    function getBestMove(gameState, difficulty) {
        return new Promise((resolve) => {
            // When the worker sends a message, resolve the promise
            worker.onmessage = function(e) {
                resolve(e.data);
            };
            // Send the game state to the worker
            worker.postMessage({ gameState, difficulty });
        });
    }

    return {
        init,
        getBestMove
    };
})();