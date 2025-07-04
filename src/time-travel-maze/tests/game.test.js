// This is a placeholder for the tests.
// To run these tests, you would need to open test.html in a browser.

console.log("Running tests...");

// We need to load the game script and the assertion library.
// This is tricky in a simple file-based setup.
// For a real project, we would use a test runner like Jest or Mocha.

// A simple test to check if the story object is loaded.
function testStoryLoaded() {
    assert(maze !== null, "Story should be loaded");
    console.log("testStoryLoaded: PASSED");
}

// A simple test to check the initial room.
function testInitialRoom() {
    assert(currentRoom === "start", "Initial room should be start");
    console.log("testInitialRoom: PASSED");
}

// A test to check if the currentRoom is updated correctly after a choice
function testChoiceUpdatesCurrentRoom() {
    currentRoom = "start"; // Reset currentRoom to start
    handleInput("historical"); // Simulate player choosing "historical"
    assert(currentRoom === "historical", "currentRoom should be updated to historical");
    console.log("testChoiceUpdatesCurrentRoom: PASSED");
}

// A test to check if the game starts in the start room after character creation
function testGameStartsInStartRoom() {
    characterCreationForm.dispatchEvent(new Event('submit')); // Simulate character creation
    assert(currentRoom === "start", "Game should start in the start room");
    console.log("testGameStartsInStartRoom: PASSED");
}

// A test to check if the knight's backstory is displayed when the player approaches the knight
function testKnightBackstoryIsDisplayed() {
    currentRoom = "historical";
    handleInput("castle");
    handleInput("approach");
    assert(storyOutput.innerHTML.includes("Sir Reginald Strongforth"), "Knight's backstory should be displayed");
    console.log("testKnightBackstoryIsDisplayed: PASSED");
}

// Run all tests
try {
    testStoryLoaded();
    testInitialRoom();
    testChoiceUpdatesCurrentRoom();
    testGameStartsInStartRoom();
    testKnightBackstoryIsDisplayed();
    console.log("All tests passed!");
} catch (error) {
    console.error("Test failed:", error.message);
}
