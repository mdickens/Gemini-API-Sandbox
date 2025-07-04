import { assert } from './assert.js';
import maze from '../maze.js';

console.log("Running tests...");

// A simple test to check if the story object is loaded.
function testStoryLoaded() {
    assert(maze !== null, "Story should be loaded");
    console.log("testStoryLoaded: PASSED");
}

// Run all tests
try {
    testStoryLoaded();
    console.log("All tests passed!");
} catch (error) {
    console.error("Test failed:", error.message);
}
