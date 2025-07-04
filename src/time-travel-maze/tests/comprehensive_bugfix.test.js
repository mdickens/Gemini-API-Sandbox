const comprehensiveBugfixTests = (function() {
    function testMedievalCastleRetreat() {
        game.startGame("test", 5, 5, 5);
        game.processInput("historical");
        game.processInput("medieval_castle");
        let result = game.processInput("historical");
        assert(result.room === maze.historical, "Retreating from medieval castle should lead to the historical room.");
        console.log("testMedievalCastleRetreat: PASSED");
    }

    function testHumorousEncounterChoices() {
        game.startGame("test", 5, 5, 5);
        game.processInput("historical");
        game.processInput("curious_artifact");
        let result = game.processInput("apologize");
        assert(result.message.includes("You apologize"), "Apologize choice should return a message.");
        result = game.processInput("dance");
        assert(result.message.includes("You start dancing"), "Dance choice should return a message.");
        console.log("testHumorousEncounterChoices: PASSED");
    }

    function testRoyalCourtChoices() {
        game.startGame("test", 5, 5, 5);
        // This is a bit of a hack to get to the royal court
        game.processInput("historical");
        game.processInput("medieval_castle");
        currentRoom = "royal_court";
        let result = game.processInput("kneel");
        assert(result.message.includes("You kneel"), "Kneel choice should return a message.");
        result = game.processInput("speak");
        assert(result.message.includes("You speak"), "Speak choice should return a message.");
        result = game.processInput("observe");
        assert(result.message.includes("You observe"), "Observe choice should return a message.");
        console.log("testRoyalCourtChoices: PASSED");
    }

    return {
        runTests: function() {
            try {
                testMedievalCastleRetreat();
                testHumorousEncounterChoices();
                testRoyalCourtChoices();
                console.log("All comprehensive bugfix tests passed!");
            } catch (error) {
                console.error("Comprehensive bugfix test failed:", error.message);
            }
        }
    };
})();
