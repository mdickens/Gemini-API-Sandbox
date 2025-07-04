
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
      ignore: "Ignore the historian and proceed",
      curious_artifact: "Examine a curious artifact in the corner"
    }
  },
  humorous_encounter: {
    description: "You examine a dusty old gramophone, and suddenly it starts playing a jaunty tune from the future! A bewildered Victorian gentleman spills his tea.",
    choices: {
      apologize: "Apologize to the gentleman",
      dance: "Start dancing to the music"
    },
    end_of_path: "historical"
  },
  medieval_castle: {
    description: "You arrive at a medieval castle. A knight stands guard at the entrance.",
    choices: {
      approach: "Approach the knight",
      retreat: "Retreat back to the historical hall"
    },
    dynamic_descriptions: {
      approach: "The knight greets you with a stern look and demands your purpose.",
      retreat: "You quickly retreat back to the historical hall, feeling intimidated by the knight."
    }
  },
  royal_court: {
    description: "You are now in the royal court. The King is seated on his throne.",
    choices: {
      kneel: "Kneel before the King",
      speak: "Speak to the King",
      observe: "Observe the court from a distance"
    },
    puzzle: {
      question: "What is the capital of France?",
      answer: "paris"
    }
  },
  royal_dilemma: {
    description: "The King asks you to deliver a message to a neighboring kingdom, but you overhear a plot against him. What do you do?",
    choices: {
      deliver_message: "Deliver the message as requested",
      warn_king: "Warn the King about the plot",
      explore_library: "Secretly explore the royal library"
    }
  },
  suspenseful_library: {
    description: "You sneak into the royal library. The air is thick with dust and the scent of old parchment. You hear faint whispers from the shadows.",
    choices: {
      investigate_whispers: "Investigate the whispers",
      read_ancient_tome: "Read an ancient tome",
      leave_library: "Quietly leave the library"
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
  },
  characters: {
    knight: {
      backstory: "Sir Reginald Strongforth is a brave and loyal knight who has sworn to protect the castle from all intruders. He is known for his unwavering dedication and his skill in combat."
    }
  },
  characters: {
    knight: {
      backstory: "Sir Reginald Strongforth is a brave and loyal knight who has sworn to protect the castle from all intruders. He is known for his unwavering dedication and his skill in combat."
    }
  }
};

export default maze;
