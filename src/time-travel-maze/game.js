const game = (function() {
    let player = {};
    let currentRoom = "start";
    let playerInventory = [];
    let previousRoom = "";
    let completedPaths = {
        historical: false,
        futuristic: false,
        prehistoric: false
    };

    function startGame(name, strength, intelligence, charisma) {
        player.name = name;
        player.strength = strength;
        player.intelligence = intelligence;
        player.charisma = charisma;
        currentRoom = "start";
    }

    function processInput(command) {
        const room = maze[currentRoom];

        if (room.puzzle && command === room.puzzle.answer) {
            delete room.puzzle;
            return { message: "Correct! You solved the puzzle." };
        } else if (room.choices && room.choices[command]) {
            previousRoom = currentRoom;
            currentRoom = command;
            checkEndOfPath();
            return { room: maze[currentRoom] };
        } else if (command === "ignore" && currentRoom === "historical") {
            return { message: "You ignore the historian and continue to explore the grand hall." };
        } else if (command === "decline" && currentRoom === "futuristic") {
            return { message: "You decline the gadget and the robot zips away." };
        } else if (command === "approach" && currentRoom === "medieval_castle") {
            return { room: maze[currentRoom], character: "knight" };
        } else if (command === "curious_artifact" && currentRoom === "historical") {
            currentRoom = "humorous_encounter";
            checkEndOfPath();
            return { room: maze[currentRoom] };
        } else if (command === "explore_library" && currentRoom === "royal_dilemma") {
            currentRoom = "suspenseful_library";
            checkEndOfPath();
            return { room: maze[currentRoom] };
        } else if (command === "accept" && currentRoom === "futuristic") {
            currentRoom = "futuristic_gadget";
            checkEndOfPath();
            return { room: maze[currentRoom] };
        } else if (command === "explore_market" && currentRoom === "futuristic") {
            currentRoom = "robot_dilemma";
            return { room: maze[currentRoom] };
        } else if (command === "try_to_fix" && currentRoom === "futuristic_gadget") {
            checkEndOfPath();
            return { message: "You tinker with the gadget, and it starts translating everything into interpretive dance moves. The robot looks confused." };
        } else if (command === "ignore_gadget" && currentRoom === "futuristic_gadget") {
            checkEndOfPath();
            return { message: "You decide the gadget is more trouble than it's worth and move on." };
        } else if (command === "apologize" && currentRoom === "humorous_encounter") {
            return { message: "You apologize, and the gentleman graciously accepts, offering you a cup of tea." };
        } else if (command === "dance" && currentRoom === "humorous_encounter") {
            return { message: "You start dancing. The gentleman, after a moment of shock, joins in!" };
        } else if (command === "kneel" && currentRoom === "royal_court") {
            return { message: "You kneel before the King. He nods in approval." };
        } else if (command === "speak" && currentRoom === "royal_court") {
            return { message: "You speak to the King. He listens intently." };
        } else if (command === "observe" && currentRoom === "royal_court") {
            return { message: "You observe the court from a distance, taking in the scene." };
        } else if (command === "deliver_message" && currentRoom === "royal_dilemma") {
            return { message: "You choose to deliver the message as requested." };
        } else if (command === "warn_king" && currentRoom === "royal_dilemma") {
            return { message: "You warn the King of the plot. He is grateful for your loyalty." };
        } else if (command === "investigate_whispers" && currentRoom === "suspenseful_library") {
            return { message: "You investigate the whispers and find a hidden passage." };
        } else if (command === "read_ancient_tome" && currentRoom === "suspenseful_library") {
            return { message: "You read from an ancient tome and learn a forgotten secret." };
        } else if (command === "leave_library" && currentRoom === "suspenseful_library") {
            return { message: "You quietly leave the library." };
        } else if (command === "reshape_reality" && currentRoom === "nexus_of_time") {
            return { message: "You attempt to reshape reality, but the power is too great. You are returned to the Nexus." };
        } else if (command === "return_home" && currentRoom === "nexus_of_time") {
            return { message: "You choose to return to your own time, the adventure forever a part of you." };
        } else if (command === "prioritize_efficiency" && currentRoom === "robot_dilemma") {
            checkEndOfPath();
            return { message: "The robots nod in agreement and immediately begin optimizing their processes, ignoring all creative pursuits." };
        } else if (command === "prioritize_creativity" && currentRoom === "robot_dilemma") {
            checkEndOfPath();
            return { message: "The robots light up with new ideas, and begin composing symphonies and painting abstract art." };
        } else if (command === "ask_more_questions" && currentRoom === "robot_dilemma") {
            checkEndOfPath();
            return { message: "The robots engage in a deep philosophical discussion with you, revealing the complexities of their society." };
        } else if (command === "fight" && currentRoom === "prehistoric") {
            currentRoom = "dinosaur_confrontation";
            return { room: maze[currentRoom] };
        } else if (command === "run" && currentRoom === "prehistoric") {
            checkEndOfPath();
            return { message: "You run as fast as you can, narrowly escaping the T-Rex." };
        } else if (command === "hide" && currentRoom === "prehistoric") {
            checkEndOfPath();
            return { message: "You hide in the dense foliage, and the T-Rex lumbers past, unaware of your presence." };
        } else if (command === "climb_tree" && currentRoom === "dinosaur_confrontation") {
            checkEndOfPath();
            return { message: "You scramble up a tree just as the T-Rex snaps its jaws where you were standing. You are safe for now." };
        } else if (command === "distract_trex" && currentRoom === "dinosaur_confrontation") {
            checkEndOfPath();
            return { message: "You throw a rock, distracting the T-Rex. It turns its attention to the sound, allowing you to slip away." };
        } else if (command === "examine_symbols" && currentRoom === "ancient_ruins") {
            checkEndOfPath();
            return { message: "The symbols glow faintly as you touch them, and you feel a surge of ancient power." };
        } else if (command === "enter_temple" && currentRoom === "ancient_ruins") {
            checkEndOfPath();
            return { message: "You enter the crumbling temple, and the air grows heavy with an unknown energy." };
        } else {
            return { message: "Invalid command." };
        }
    }

    function checkEndOfPath() {
        const room = maze[currentRoom];
        if (room && room.end_of_path) {
            completedPaths[room.end_of_path] = true;
            if (completedPaths.historical && completedPaths.futuristic && completedPaths.prehistoric) {
                currentRoom = "nexus_of_time";
            }
        }
    }

    return {
        startGame,
        processInput
    };
})();
