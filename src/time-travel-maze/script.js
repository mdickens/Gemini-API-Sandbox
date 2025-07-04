import maze from './maze.js';

const characterCreationContainer = document.getElementById('character-creation-container');
const characterCreationForm = document.getElementById('character-creation-form');
const gameContainer = document.getElementById('game-container');
const storyOutput = document.getElementById('story-output');
const playerInput = document.getElementById('player-input');
const submitButton = document.getElementById('submit-button');

let player = {};
let currentRoom = "start";
let playerInventory = [];
let previousRoom = "";
let completedPaths = {
    historical: false,
    futuristic: false,
    prehistoric: false
};

characterCreationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log("Start Game button clicked!");
    player.name = document.getElementById('player-name').value;
    player.strength = parseInt(document.getElementById('strength').value);
    player.intelligence = parseInt(document.getElementById('intelligence').value);
    player.charisma = parseInt(document.getElementById('charisma').value);

    console.log("Player stats:", player);

    characterCreationContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    console.log("Display properties changed.");

    currentRoom = "start";
    console.log("Current room set to:", currentRoom);
    displayRoom(currentRoom);
    console.log("displayRoom function called.");
});

function displayRoom(roomId, character = null) {
    const room = maze[roomId];
    if (room) {
        let description = room.description;
        if (room.dynamic_descriptions && previousRoom && room.dynamic_descriptions[previousRoom]) {
            description = room.dynamic_descriptions[previousRoom];
        }
        let output = `<p><strong>${room.name || roomId}</strong></p>`;
        output += `<p>${description}</p>`;

        if (character && maze.characters && maze.characters[character]) {
            output += `<p><strong>${character.toUpperCase()}</strong></p>`;
            output += `<p>${maze.characters[character].backstory}</p>`;
        }

        if (room.puzzle) {
            output += `<p><strong>Puzzle:</strong> ${room.puzzle.question}</p>`;
        }

        if (room.choices) {
            output += "<p><strong>Choices:</strong></p>";
            output += "<ul>";
            for (const choice in room.choices) {
                output += `<li><strong>${choice}:</strong> ${room.choices[choice]}</li>`;
            }
            output += "</ul>";
        }

        storyOutput.innerHTML = output;
    } else {
        storyOutput.innerHTML = `<p>Error: Room "${roomId}" not found.</p>`;
    }
}

function handleInput() {
    const command = playerInput.value.toLowerCase().trim();
    playerInput.value = '';
    const room = maze[currentRoom];

    if (room.puzzle && command === room.puzzle.answer) {
        storyOutput.innerHTML += "<p>Correct! You solved the puzzle.</p>";
        delete room.puzzle;
    } else if (room.choices && room.choices[command]) {
        previousRoom = currentRoom;
        currentRoom = command;
        displayRoom(currentRoom);
        checkEndOfPath();
    } else if (command === "approach" && currentRoom === "medieval_castle") {
        displayRoom(currentRoom, "knight");
    } else if (command === "curious_artifact" && currentRoom === "historical") {
        currentRoom = "humorous_encounter";
        displayRoom(currentRoom);
        checkEndOfPath();
    } else if (command === "explore_library" && currentRoom === "royal_dilemma") {
        currentRoom = "suspenseful_library";
        displayRoom(currentRoom);
        checkEndOfPath();
    } else if (command === "accept" && currentRoom === "futuristic") {
        currentRoom = "futuristic_gadget";
        displayRoom(currentRoom);
        checkEndOfPath();
    } else if (command === "explore_market" && currentRoom === "futuristic") {
        currentRoom = "robot_dilemma";
        displayRoom(currentRoom);
    } else if (command === "try_to_fix" && currentRoom === "futuristic_gadget") {
        storyOutput.innerHTML += "<p>You tinker with the gadget, and it starts translating everything into interpretive dance moves. The robot looks confused.</p>";
        checkEndOfPath();
    } else if (command === "ignore_gadget" && currentRoom === "futuristic_gadget") {
        storyOutput.innerHTML += "<p>You decide the gadget is more trouble than it's worth and move on.</p>";
        checkEndOfPath();
    } else if (command === "prioritize_efficiency" && currentRoom === "robot_dilemma") {
        storyOutput.innerHTML += "<p>The robots nod in agreement and immediately begin optimizing their processes, ignoring all creative pursuits.</p>";
        checkEndOfPath();
    } else if (command === "prioritize_creativity" && currentRoom === "robot_dilemma") {
        storyOutput.innerHTML += "<p>The robots light up with new ideas, and begin composing symphonies and painting abstract art.</p>";
        checkEndOfPath();
    } else if (command === "ask_more_questions" && currentRoom === "robot_dilemma") {
        storyOutput.innerHTML += "<p>The robots engage in a deep philosophical discussion with you, revealing the complexities of their society.</p>";
        checkEndOfPath();
    } else if (command === "fight" && currentRoom === "prehistoric") {
        currentRoom = "dinosaur_confrontation";
        displayRoom(currentRoom);
    } else if (command === "run" && currentRoom === "prehistoric") {
        storyOutput.innerHTML += "<p>You run as fast as you can, narrowly escaping the T-Rex.</p>";
        checkEndOfPath();
    } else if (command === "hide" && currentRoom === "prehistoric") {
        storyOutput.innerHTML += "<p>You hide in the dense foliage, and the T-Rex lumbers past, unaware of your presence.</p>";
        checkEndOfPath();
    } else if (command === "climb_tree" && currentRoom === "dinosaur_confrontation") {
        storyOutput.innerHTML += "<p>You scramble up a tree just as the T-Rex snaps its jaws where you were standing. You are safe for now.</p>";
        checkEndOfPath();
    } else if (command === "distract_trex" && currentRoom === "dinosaur_confrontation") {
        storyOutput.innerHTML += "<p>You throw a rock, distracting the T-Rex. It turns its attention to the sound, allowing you to slip away.</p>";
        checkEndOfPath();
    } else if (command === "examine_symbols" && currentRoom === "ancient_ruins") {
        storyOutput.innerHTML += "<p>The symbols glow faintly as you touch them, and you feel a surge of ancient power.</p>";
        checkEndOfPath();
    } else if (command === "enter_temple" && currentRoom === "ancient_ruins") {
        storyOutput.innerHTML += "<p>You enter the crumbling temple, and the air grows heavy with an unknown energy.</p>";
        checkEndOfPath();
    } else {
        storyOutput.innerHTML += "<p>Invalid command.</p>";
    }
}

function checkEndOfPath() {
    const room = maze[currentRoom];
    if (room && room.end_of_path) {
        completedPaths[room.end_of_path] = true;
        if (completedPaths.historical && completedPaths.futuristic && completedPaths.prehistoric) {
            currentRoom = "nexus_of_time";
            displayRoom(currentRoom);
        }
    }
}

submitButton.addEventListener('click', handleInput);
playerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});