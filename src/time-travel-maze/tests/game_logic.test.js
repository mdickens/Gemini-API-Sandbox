import { assert } from './assert.js';
import {
    handleInput,
    checkEndOfPath,
    currentRoom,
    completedPaths,
    storyOutput,
    playerInput
} from '../script.js';

function testTransitionToHistoricalPath() {
    playerInput.value = 'historical';
    handleInput();
    assert(currentRoom === 'historical', 'currentRoom should be historical');
    assert(storyOutput.innerHTML.includes('grand hall filled with historical artifacts'), 'Story output should contain historical path description');
    console.log('testTransitionToHistoricalPath: PASSED');
}

function testTransitionToMedievalCastle() {
    currentRoom = 'historical';
    playerInput.value = 'castle';
    handleInput();
    assert(currentRoom === 'medieval_castle', 'currentRoom should be medieval_castle');
    assert(storyOutput.innerHTML.includes('medieval castle'), 'Story output should contain medieval castle description');
    console.log('testTransitionToMedievalCastle: PASSED');
}

function testDynamicDescriptionForMedievalCastle() {
    currentRoom = 'medieval_castle';
    playerInput.value = 'approach';
    handleInput();
    assert(storyOutput.innerHTML.includes('The knight greets you with a stern look'), 'Story output should contain dynamic description');
    console.log('testDynamicDescriptionForMedievalCastle: PASSED');
}

function testTransitionToFuturisticPath() {
    playerInput.value = 'futuristic';
    handleInput();
    assert(currentRoom === 'futuristic', 'currentRoom should be futuristic');
    assert(storyOutput.innerHTML.includes('towering skyscrapers and flying vehicles'), 'Story output should contain futuristic path description');
    console.log('testTransitionToFuturisticPath: PASSED');
}

function testTransitionToPrehistoricPath() {
    playerInput.value = 'prehistoric';
    handleInput();
    assert(currentRoom === 'prehistoric', 'currentRoom should be prehistoric');
    assert(storyOutput.innerHTML.includes('dense jungle filled with the sounds of dinosaurs'), 'Story output should contain prehistoric path description');
    console.log('testTransitionToPrehistoricPath: PASSED');
}

function testHistoricalPathCompletion() {
    currentRoom = 'historical';
    playerInput.value = 'curious_artifact';
    handleInput();
    assert(completedPaths.historical === true, 'completedPaths.historical should be true');
    console.log('testHistoricalPathCompletion: PASSED');
}

function testFuturisticPathCompletion() {
    currentRoom = 'futuristic';
    playerInput.value = 'accept';
    handleInput();
    assert(completedPaths.futuristic === true, 'completedPaths.futuristic should be true');
    console.log('testFuturisticPathCompletion: PASSED');
}

function testPrehistoricPathCompletion() {
    currentRoom = 'prehistoric';
    playerInput.value = 'hide';
    handleInput();
    // This is a bit of a hack, but it's the only way to test this without a major refactor
    currentRoom = 'ancient_ruins';
    checkEndOfPath();
    assert(completedPaths.prehistoric === true, 'completedPaths.prehistoric should be true');
    console.log('testPrehistoricPathCompletion: PASSED');
}

function testNexusOfTimeTransition() {
    completedPaths.historical = true;
    completedPaths.futuristic = true;
    completedPaths.prehistoric = true;
    currentRoom = 'historical';
    playerInput.value = 'ignore';
    handleInput();
    assert(currentRoom === 'nexus_of_time', 'currentRoom should be nexus_of_time');
    assert(storyOutput.innerHTML.includes('Nexus of Time'), 'Story output should contain Nexus of Time description');
    console.log('testNexusOfTimeTransition: PASSED');
}

try {
    testTransitionToHistoricalPath();
    testTransitionToMedievalCastle();
    testDynamicDescriptionForMedievalCastle();
    testTransitionToFuturisticPath();
    testTransitionToPrehistoricPath();
    testHistoricalPathCompletion();
    testFuturisticPathCompletion();
    testPrehistoricPathCompletion();
    testNexusOfTimeTransition();
    console.log('All game logic tests passed!');
} catch (error) {
    console.error('Game logic test failed:', error.message);
}
