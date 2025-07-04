
// maze.js

const maze = {
  start: {
    description: "You stand at the entrance to a mysterious maze. Three paths lie before you: one leading to a historical site, one to a futuristic city, and one to a prehistoric jungle. Which path do you choose?",
    choices: {
      historical: "Enter the historical path",
      futuristic: "Venture into the futuristic path",
      prehistoric: "Brave the prehistoric path"
    }
  },
  historical: {
    description: "You find yourself in a grand hall filled with historical artifacts. A famous historian approaches you.",
    choices: {
      castle: "Proceed to the Medieval Castle",
      ignore: "Ignore the historian and proceed"
    }
  },
  medieval_castle: {
    description: "You arrive at a medieval castle. A knight stands guard at the entrance.",
    choices: {
      approach: "Approach the knight",
      retreat: "Retreat back to the historical hall"
    }
  },
  royal_court: {
    description: "You are now in the royal court. The King is seated on his throne.",
    choices: {
      kneel: "Kneel before the King",
      speak: "Speak to the King"
    }
  },
  futuristic: {
    description: "You are surrounded by towering skyscrapers and flying vehicles. A quirky robot offers you a strange gadget.",
    choices: {
      accept: "Accept the gadget",
      decline: "Decline the gadget"
    }
  },
  prehistoric: {
    description: "You are in a dense jungle filled with the sounds of dinosaurs. A towering T-Rex blocks your path.",
    choices: {
      fight: "Fight the T-Rex",
      run: "Run away"
    }
  }
};

module.exports = maze;
