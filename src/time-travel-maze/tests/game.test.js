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
    assert(currentRoom === 0, "Initial room should be 0");
    console.log("testInitialRoom: PASSED");
}

// Run all tests
try {
    testStoryLoaded();
    testInitialRoom();
    console.log("All tests passed!");
} catch (error) {
    console.error("Test failed:", error.message);
}
