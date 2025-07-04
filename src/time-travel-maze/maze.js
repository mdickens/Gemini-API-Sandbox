
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
      decline: "Decline the gadget",
      explore_market: "Explore the futuristic market"
    }
  },
  futuristic_gadget: {
    description: "The robot's gadget hums in your hand. It seems to be a universal translator, but it's malfunctioning, translating everything into opera lyrics.",
    choices: {
      try_to_fix: "Try to fix the gadget",
      ignore_gadget: "Ignore the gadget and move on"
    },
    end_of_path: "futuristic"
  },
  robot_dilemma: {
    description: "You encounter a group of robots debating a complex ethical problem: should they prioritize efficiency or creativity? They ask for your input.",
    choices: {
      prioritize_efficiency: "Advise them to prioritize efficiency",
      prioritize_creativity: "Advise them to prioritize creativity",
      ask_more_questions: "Ask more questions about their society"
    }
  },
  prehistoric: {
    description: "You are in a dense jungle filled with the sounds of dinosaurs. A towering T-Rex blocks your path.",
    choices: {
      fight: "Fight the T-Rex",
      run: "Run away",
      hide: "Hide in the dense foliage"
    }
  },
  dinosaur_confrontation: {
    description: "The T-Rex roars and charges! You must act fast.",
    choices: {
      climb_tree: "Climb a nearby tree",
      distract_trex: "Distract the T-Rex with a loud noise"
    }
  },
  ancient_ruins: {
    description: "You stumble upon ancient ruins, overgrown with vines. Strange symbols are carved into the stone.",
    choices: {
      examine_symbols: "Examine the symbols",
      enter_temple: "Enter the crumbling temple"
    },
    end_of_path: "prehistoric"
  },
  characters: {
    knight: {
      backstory: "Sir Reginald Strongforth is a brave and loyal knight who has sworn to protect the castle from all intruders. He is known for his unwavering dedication and his skill in combat."
    }
  },
  nexus_of_time: {
    description: "You have conquered the maze and reached the Nexus of Time. The past, present, and future are all laid out before you. You have the power to reshape reality. What will you do?",
    choices: {
      reshape_reality: "Attempt to reshape reality",
      return_home: "Return to your own time"
    }
  }
};
