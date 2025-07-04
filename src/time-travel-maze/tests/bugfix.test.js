const bugfixTests = (function() {
    function testInvalidRoomChoice() {
        game.startGame("test", 5, 5, 5);
        let result = game.processInput("castle");
        assert(result.room === undefined, "Invalid room choice should not return a room.");
        assert(result.message === "Invalid command.", "Invalid room choice should return an error message.");
        console.log("testInvalidRoomChoice: PASSED");
    }

    function testValidRoomChoice() {
        game.startGame("test", 5, 5, 5);
        let result = game.processInput("historical");
        assert(result.room === maze.historical, "Valid room choice should return the correct room.");
        console.log("testValidRoomChoice: PASSED");
    }

    function testActionChoice() {
        game.startGame("test", 5, 5, 5);
        game.processInput("historical");
        let result = game.processInput("ignore");
        assert(result.message === "You ignore the historian and continue to explore the grand hall.", "Action choice should return the correct message.");
        console.log("testActionChoice: PASSED");
    }

    return {
        runTests: function() {
            try {
                testInvalidRoomChoice();
                testValidRoomChoice();
                testActionChoice();
                console.log("All bugfix tests passed!");
            } catch (error) {
                console.error("Bugfix test failed:", error.message);
            }
        }
    };
})();
