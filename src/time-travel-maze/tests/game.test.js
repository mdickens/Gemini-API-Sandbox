// This is a placeholder for the tests.
// To run these tests, you would need to open test.html in a browser.

console.log("Running tests...");

// We need to load the game script and the assertion library.
// This is tricky in a simple file-based setup.
// For a real project, we would use a test runner like Jest or Mocha.

// A simple test to check if the story object is loaded.
function testStoryLoaded() {
    assert(story !== null, "Story should be loaded");
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

// Run all tests
try {
    testStoryLoaded();
    testInitialRoom();
    testChoiceUpdatesCurrentRoom();
    console.log("All tests passed!");
} catch (error) {
    console.error("Test failed:", error.message);
}
