const assert = require('assert');
const maze = require('../maze.js');
const game = require('../game.js');

global.assert = assert;
global.maze = maze;
global.game = game;

require('./game.test.js');
require('./game_logic.test.js');
require('./maze.test.js');
require('./bugfix.test.js');
require('./comprehensive_bugfix.test.js');
