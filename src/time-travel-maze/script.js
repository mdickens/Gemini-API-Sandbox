import { startGame, processInput } from './game.js';
import maze from './maze.js';

const characterCreationContainer = document.getElementById('character-creation-container');
const characterCreationForm = document.getElementById('character-creation-form');
const gameContainer = document.getElementById('game-container');
const storyOutput = document.getElementById('story-output');
const playerInput = document.getElementById('player-input');
const submitButton = document.getElementById('submit-button');

characterCreationForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const playerName = document.getElementById('player-name').value;
    const strength = parseInt(document.getElementById('strength').value);
    const intelligence = parseInt(document.getElementById('intelligence').value);
    const charisma = parseInt(document.getElementById('charisma').value);

    startGame(playerName, strength, intelligence, charisma);

    characterCreationContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    displayRoom("start");
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
    const result = processInput(command);

    if (result.message) {
        storyOutput.innerHTML += `<p>${result.message}</p>`;
    } else if (result.room) {
        displayRoom(result.room.name || result.room, result.character);
    }
}

submitButton.addEventListener('click', handleInput);
playerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});
