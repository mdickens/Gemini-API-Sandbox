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
    player.name = document.getElementById('player-name').value;
    player.strength = parseInt(document.getElementById('strength').value);
    player.intelligence = parseInt(document.getElementById('intelligence').value);
    player.charisma = parseInt(document.getElementById('charisma').value);

    characterCreationContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    currentRoom = "start";
    displayRoom(currentRoom);
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
    } else {
        storyOutput.innerHTML += "<p>Invalid command.</p>";
    }
}

function checkEndOfPath() {
    const room = maze[currentRoom];
    if (room && room.end_of_path) {
        completedPaths[room.end_of_path] = true;
        if (completedPaths.historical && completedPaths.futuristic && completedPaths.prehistoric) {
            // Unlock the final room - assuming 'nexus_of_time' is the final room
            // This part needs to be carefully designed based on how the final room is integrated.
            // For now, let's just display a message.
            storyOutput.innerHTML += "<p>You have completed all paths and unlocked the Nexus of Time!</p>";
        }
    }
}

submitButton.addEventListener('click', handleInput);
playerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});