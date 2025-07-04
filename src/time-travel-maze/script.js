import maze from './maze.js';

// const story = {
    rooms: [
        {
            id: 0,
            name: "The Chronosynclastic Infundibulum",
            description: "You find yourself in a room that seems to be made of pure light. A voice echoes, 'Welcome, traveler. This is the Chronosynclastic Infundibulum, the heart of the maze. From here, you can go anywhere, anywhen. But be warned, the path you choose will shape your destiny.' Before you are three doors.",
            exits: [
                { direction: "north", to: 1, description: "A sturdy oak door with iron fittings. You hear the sounds of a bustling medieval marketplace." },
                { direction: "east", to: 2, description: "A sleek, metallic door that hums with a low energy. You see flashing lights under the door." },
                { direction: "west", to: 3, description: "A rough-hewn stone archway. You hear the distant roar of a large creature and the chirping of strange birds." }
            ],
            items: [
                { name: "device", description: "A strange, glowing device. It seems to hum with a faint energy." }
            ]
        },
        {
            id: 1,
            name: "Medieval Marketplace",
            description: "You step into a bustling medieval marketplace. The air is filled with the smells of roasting meat and unwashed bodies. A knight in shining armor is trying to buy a turkey, but the merchant insists it's a dragon egg.",
            exits: [
                { direction: "south", to: 0, description: "Return to the Chronosynclastic Infundibulum." },
                { direction: "north", to: 4, description: "A grand stone gate leads to a castle." }
            ]
        },
        {
            id: 2,
            name: "Futuristic City",
            description: "You are in a gleaming city of chrome and light. Flying vehicles zip past, and robots are walking tiny robot dogs. A friendly android offers you a nutrient paste that tastes suspiciously like chicken.",
            exits: [
                { direction: "west", to: 0, description: "Return to the Chronosynclastic Infundibulum." },
                { direction: "east", to: 8, description: "A door labeled 'Cybernetics Lab'." }
            ]
        },
        {
            id: 3,
            name: "Prehistoric Jungle",
            description: "You find yourself in a lush, humid jungle. Giant ferns tower over you, and the air is thick with the scent of unknown flowers. In the distance, you see a Brontosaurus munching on leaves.",
            exits: [
                { direction: "east", to: 0, description: "Return to the Chronosynclastic Infundibulum." },
                { direction: "north", to: 11, description: "A path leads deeper into the jungle." }
            ]
        },
        {
            id: 4,
            name: "Castle Gates",
            description: "You stand before the imposing gates of a large stone castle. Two guards block your path. They don't look friendly.",
            exits: [
                { direction: "south", to: 1, description: "Return to the marketplace." },
                { direction: "north", to: 5, description: "Try to enter the castle." }
            ]
        },
        {
            id: 5,
            name: "The Royal Court",
            description: "You've managed to get past the guards and find yourself in the royal court. The king is holding a feast. He looks at you with a mixture of suspicion and amusement.",
            exits: [
                { direction: "south", to: 4, description: "Leave the castle." },
                { direction: "up", to: 6, description: "A spiral staircase leads up to a tower." }
            ],
            items: [
                { name: "key", description: "A small, ornate silver key." }
            ]
        },
        {
            id: 6,
            name: "The Wizard's Tower",
            description: "You've climbed the stairs to a circular room filled with bubbling potions, ancient books, and a telescope pointed at the stars. A wizard with a long white beard is cackling over a cauldron.",
            exits: [
                { direction: "down", to: 5, description: "Return to the royal court." },
                { direction: "east", to: 7, description: "A small, locked door.", locked: true, key: "key" }
            ]
        },
        {
            id: 7,
            name: "The Wizard's Inner Sanctum",
            description: "You've unlocked the door and entered the wizard's inner sanctum. The room is filled with powerful artifacts and a large, open book of spells. You've found the heart of the wizard's power!",
            exits: [
                { direction: "west", to: 6, description: "Return to the wizard's tower." }
            ],
            end_of_path: "historical"
        },
        {
            id: 8,
            name: "Cybernetics Lab",
            description: "You've entered a sterile white lab filled with robotic parts and strange machinery. A robot on a table is sparking and twitching. It seems to be stuck in a loop.",
            exits: [
                { direction: "west", to: 2, description: "Return to the Futuristic City." },
                { direction: "north", to: 9, description: "A large door labeled 'Robot Factory'.", locked: true, puzzle: "robot" }
            ]
        },
        {
            id: 9,
            name: "Robot Factory",
            description: "You're in a massive factory with conveyor belts, robotic arms, and sparks flying everywhere. The noise is deafening. You see a control panel on a raised platform.",
            exits: [
                { direction: "south", to: 8, description: "Return to the Cybernetics Lab." },
                { direction: "up", to: 10, description: "A ladder leads up to the control panel." }
            ]
        },
        {
            id: 10,
            name: "AI Core",
            description: "You've reached the AI core. A giant, pulsating red light is in the center of the room. A voice booms, 'I am the Master Control Program. You cannot stop me.'",
            exits: [
                { direction: "down", to: 9, description: "Leave the AI Core." }
            ],
            puzzle: "ai",
            end_of_path: "futuristic"
        },
        {
            id: 11,
            name: "Dinosaur Nest",
            description: "You've stumbled upon a massive nest. A fearsome T-Rex is guarding it, and it looks hungry. It's blocking a path to the east.",
            exits: [
                { direction: "south", to: 3, description: "Return to the jungle." },
                { direction: "east", to: 12, description: "A path leads to a hidden cave.", locked: true, puzzle: "t-rex" }
            ],
            items: [
                { name: "bone", description: "A large, juicy-looking bone." }
            ],
            puzzle: "t-rex"
        },
        {
            id: 12,
            name: "Hidden Cave",
            description: "You've found a dark cave. The walls are covered in ancient paintings. There's a passage leading further in, but it's too dark to see.",
            exits: [
                { direction: "west", to: 11, description: "Return to the dinosaur nest." },
                { direction: "north", to: 13, description: "A dark passage.", locked: true, puzzle: "darkness" }
            ],
            items: [
                { name: "torch", description: "An unlit torch." }
            ]
        },
        {
            id: 13,
            name: "Ancient Temple",
            description: "You've discovered a magnificent temple hidden deep in the jungle. In the center of the room is a pedestal with a strange glowing artifact.",
            exits: [
                { direction: "south", to: 12, description: "Return to the hidden cave." }
            ],
            puzzle: "artifact",
            end_of_path: "prehistoric"
        },
        {
            id: 14,
            name: "The Nexus of Time",
            description: "You have conquered the maze and reached the Nexus of Time. The past, present, and future are all laid out before you. You have the power to reshape reality. What will you do?",
            exits: []
        }
    ]
};

const characterCreationContainer = document.getElementById('character-creation-container');
const characterCreationForm = document.getElementById('character-creation-form');
const gameContainer = document.getElementById('game-container');
const storyOutput = document.getElementById('story-output');
const playerInput = document.getElementById('player-input');
const submitButton = document.getElementById('submit-button');

let player = {};
let currentRoom = "start"; // Changed to "start"
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

    displayRoom(currentRoom);
});


function displayRoom(roomId) {
    const room = maze[roomId]; // Changed to use maze object
    if (room) {
        let description = room.description;
        if (room.dynamic_descriptions && maze[previousRoom] && room.dynamic_descriptions[previousRoom]) {
            description = room.dynamic_descriptions[previousRoom];
        }
        let output = `<p><strong>${roomId}</strong></p>`; // Display room ID for now
        output += `<p>${description}</p>`;

        if (room.choices) { // Display choices
            output += "<p><strong>Choices:</strong></p>";
            output += "<ul>";
            for (const choice in room.choices) {
                output += `<li><strong>${choice}:</strong> ${room.choices[choice]}</li>`;
            }
            output += "</ul>";
        }

        storyOutput.innerHTML = output;
    }
}

function handleInput() {
    const command = playerInput.value.toLowerCase().trim();
    playerInput.value = '';
    const room = story.rooms.find(r => r.id === currentRoom);

    if (command.startsWith("go ")) {
        const direction = command.split(" ")[1];
        const exit = room.exits.find(e => e.direction === direction);
        if (exit) {
            if (exit.locked) {
                storyOutput.innerHTML += "<p>The way is blocked.</p>";
            } else {
                currentRoom = exit.to;
                displayRoom(currentRoom);
                checkEndOfPath();
            }
        } else {
            storyOutput.innerHTML += "<p>You can't go that way.</p>";
        }
    } else if (command.startsWith("take ")) {
        const itemName = command.split(" ")[1];
        if (room.items) {
            const itemIndex = room.items.findIndex(i => i.name === itemName);
            if (itemIndex !== -1) {
                const item = room.items.splice(itemIndex, 1)[0];
                playerInventory.push(item);
                storyOutput.innerHTML += `<p>You take the ${itemName}.</p>`;
                displayRoom(currentRoom);
            } else {
                storyOutput.innerHTML += "<p>You don't see that here.</p>";
            }
        } else {
            storyOutput.innerHTML += "<p>You don't see that here.</p>";
        }
    } else if (command === "inventory") {
        if (playerInventory.length > 0) {
            let inventoryList = "<p><strong>You are carrying:</strong></p><ul>";
            playerInventory.forEach(item => {
                inventoryList += `<li>${item.name}</li>`;
            });
            inventoryList += "</ul>";
            storyOutput.innerHTML += inventoryList;
        } else {
            storyOutput.innerHTML += "<p>You are not carrying anything.</p>";
        }
    } else if (command.startsWith("unlock ")) {
        const direction = command.split(" ")[1];
        const exit = room.exits.find(e => e.direction === direction);
        if (exit && exit.locked) {
            const key = playerInventory.find(i => i.name === exit.key);
            if (key) {
                exit.locked = false;
                storyOutput.innerHTML += "<p>You unlock the door.</p>";
            } else {
                storyOutput.innerHTML += "<p>You don't have the key for that.</p>";
            }
        } else {
            storyOutput.innerHTML += "<p>You can't unlock that.</p>";
        }
    } else if (command.startsWith("use ")) {
        const itemName = command.split(" ")[1];
        const item = playerInventory.find(i => i.name === itemName);
        if (item) {
            if (room.puzzle === "robot" && itemName === "device") {
                storyOutput.innerHTML += "<p>You use the device on the sparking robot. It whirs to life and unlocks the door to the Robot Factory.</p>";
                const exit = room.exits.find(e => e.puzzle === "robot");
                if (exit) {
                    exit.locked = false;
                }
            } else if (room.puzzle === "ai" && itemName === "device") {
                storyOutput.innerHTML += "<p>You activate the device, and time seems to slow down. The AI's voice becomes distorted and then fades away. You've defeated the Master Control Program!</p>";
                room.end_of_path = "futuristic";
                checkEndOfPath();
            } else if (room.puzzle === "t-rex" && itemName === "bone") {
                storyOutput.innerHTML += "<p>You throw the bone to the T-Rex. It happily chomps on it, forgetting all about you. The path to the east is now clear.</p>";
                const exit = room.exits.find(e => e.puzzle === "t-rex");
                if (exit) {
                    exit.locked = false;
                }
            } else if (room.puzzle === "darkness" && itemName === "torch") {
                storyOutput.innerHTML += "<p>You light the torch, and the darkness recedes, revealing a passage to the north.</p>";
                const exit = room.exits.find(e => e.puzzle === "darkness");
                if (exit) {
                    exit.locked = false;
                }
            } else if (room.puzzle === "artifact" && itemName === "device") {
                storyOutput.innerHTML += "<p>You use the device on the artifact. It glows brightly, and you feel a surge of energy. You've solved the mystery of the ancient temple!</p>";
                room.end_of_path = "prehistoric";
                checkEndOfPath();
            } else {
                storyOutput.innerHTML += "<p>You can't use that here.</p>";
            }
        } else {
            storyOutput.innerHTML += "<p>You don't have that.</p>";
        }
    } else {
    function handleInput() {
    const command = playerInput.value.toLowerCase().trim();
    playerInput.value = '';
    const room = maze[currentRoom];

    if (room.choices && room.choices[command]) {
        previousRoom = currentRoom;
        currentRoom = command;
        displayRoom(currentRoom);
    } else {
        storyOutput.innerHTML += "<p>Invalid command.</p>";
    }
}
}

function checkEndOfPath() {
    const room = story.rooms.find(r => r.id === currentRoom);
    if (room && room.end_of_path) {
        completedPaths[room.end_of_path] = true;
        if (completedPaths.historical && completedPaths.futuristic && completedPaths.prehistoric) {
            // Unlock the final room
            const nexusRoom = story.rooms.find(r => r.id === 0);
            if (nexusRoom) {
                nexusRoom.exits.push({ direction: "up", to: 14, description: "A shimmering portal has appeared in the center of the room." });
            }
        }
    }
}

submitButton.addEventListener('click', handleInput);
playerInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleInput();
    }
});
