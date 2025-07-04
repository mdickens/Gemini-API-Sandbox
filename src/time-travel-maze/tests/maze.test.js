const maze = require('../maze.js');

describe('Maze', () => {
  it('should have a start room', () => {
    expect(maze.start).toBeDefined();
  });

  it('should have a start room description', () => {
    expect(maze.start.description).toBeDefined();
  });

  it('should have start room choices', () => {
    expect(maze.start.choices).toBeDefined();
  });

  it('should have a historical room', () => {
    expect(maze.historical).toBeDefined();
  });

  it('should have a futuristic room', () => {
    expect(maze.futuristic).toBeDefined();
  });

  it('should have a prehistoric room', () => {
    expect(maze.prehistoric).toBeDefined();
  });
});