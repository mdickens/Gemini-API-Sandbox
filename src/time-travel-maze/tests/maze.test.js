import maze from '../maze.js';

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

  it('should have a humorous_encounter room', () => {
    expect(maze.humorous_encounter).toBeDefined();
  });

  it('should have a medieval_castle room', () => {
    expect(maze.medieval_castle).toBeDefined();
  });

  it('should have a royal_court room', () => {
    expect(maze.royal_court).toBeDefined();
  });

  it('should have a royal_dilemma room', () => {
    expect(maze.royal_dilemma).toBeDefined();
  });

  it('should have a suspenseful_library room', () => {
    expect(maze.suspenseful_library).toBeDefined();
  });

  it('should have a futuristic room', () => {
    expect(maze.futuristic).toBeDefined();
  });

  it('should have a futuristic_gadget room', () => {
    expect(maze.futuristic_gadget).toBeDefined();
  });

  it('should have a robot_dilemma room', () => {
    expect(maze.robot_dilemma).toBeDefined();
  });

  it('should have a prehistoric room', () => {
    expect(maze.prehistoric).toBeDefined();
  });

  it('should have a dinosaur_confrontation room', () => {
    expect(maze.dinosaur_confrontation).toBeDefined();
  });

  it('should have a ancient_ruins room', () => {
    expect(maze.ancient_ruins).toBeDefined();
  });

  it('should have a nexus_of_time room', () => {
    expect(maze.nexus_of_time).toBeDefined();
  });
});