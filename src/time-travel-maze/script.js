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

    game.startGame(playerName, strength, intelligence, charisma);

    characterCreationContainer.style.display = 'none';
    gameContainer.style.display = 'block';

    displayRoom("start");
});

let currentChoices = [];

function displayRoom(roomId, character = null) {
    const room = maze[roomId];
    if (room) {
        let description = room.description;
        // Note: previousRoom is not available in the global scope anymore.
        // This part of the logic will not work as expected.
        // if (room.dynamic_descriptions && previousRoom && room.dynamic_descriptions[previousRoom]) {
        //     description = room.dynamic_descriptions[previousRoom];
        // }
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
            currentChoices = Object.keys(room.choices);
            currentChoices.forEach((choice, index) => {
                output += `<li><strong>${index + 1}:</strong> ${room.choices[choice]}</li>`;
            });
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
    const choiceIndex = parseInt(command) - 1;
    let result;
    if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < currentChoices.length) {
        result = game.processInput(currentChoices[choiceIndex]);
    } else {
        result = game.processInput(command);
    }

    if (result.message) {
        storyOutput.innerHTML += `<p>${result.message}</p>`;
    } else if (result.room) {
        // This is a hack to get the room name.
        const roomName = Object.keys(maze).find(key => maze[key] === result.room);
        displayRoom(roomName, result.character);
    }
}

submitButton.addEventListener('click', handleInput);
playerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});
