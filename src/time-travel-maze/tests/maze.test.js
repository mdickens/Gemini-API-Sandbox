import { assert } from './assert.js';
import maze from '../maze.js';

function testMazeStructure() {
    assert(maze.start, 'maze.start should be defined');
    assert(maze.start.description, 'maze.start.description should be defined');
    assert(maze.start.choices, 'maze.start.choices should be defined');
    assert(maze.historical, 'maze.historical should be defined');
    assert(maze.humorous_encounter, 'maze.humorous_encounter should be defined');
    assert(maze.medieval_castle, 'maze.medieval_castle should be defined');
    assert(maze.royal_court, 'maze.royal_court should be defined');
    assert(maze.royal_dilemma, 'maze.royal_dilemma should be defined');
    assert(maze.suspenseful_library, 'maze.suspenseful_library should be defined');
    assert(maze.futuristic, 'maze.futuristic should be defined');
    assert(maze.futuristic_gadget, 'maze.futuristic_gadget should be defined');
    assert(maze.robot_dilemma, 'maze.robot_dilemma should be defined');
    assert(maze.prehistoric, 'maze.prehistoric should be defined');
    assert(maze.dinosaur_confrontation, 'maze.dinosaur_confrontation should be defined');
    assert(maze.ancient_ruins, 'maze.ancient_ruins should be defined');
    assert(maze.nexus_of_time, 'maze.nexus_of_time should be defined');
    console.log('testMazeStructure: PASSED');
}

try {
    testMazeStructure();
    console.log('All maze tests passed!');
} catch (error) {
    console.error('Maze test failed:', error.message);
}
