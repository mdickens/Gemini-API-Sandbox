IMPORTANT: Development rules for the chess project. Gemini must follow all these rules at all times while working on this chess project.

1. Perform a git Commit after each change with: git commit -m '<<descriptive message>>'. There is no need to run git init or anything ,just git commit -m  '<<descriptive message>>' after each change.

1b. Just to clarify further rule #1: you must adopt a "commit-first" workflow. You must commit every change, even incremental ones, with a descriptive message explaining the step you are taking before running the tests to verify it. This goal is to create a transparent, step-by-step history of the work.

2. Test each change with node puppeteer.test.v2.js  to ensure no regressions. Use the puppeteer.test.v2.js test to create a direct feedback loop that can be used to test changes.

3. Before doing a major refactoring lets stop and discuss. In other words, the goal is to make steady forward progress versus going two steps forward and ten steps backward and then five steps forward and twenty steps backward. The goal is to steadily add and refine, add and refine, small changes, small steps, small improvements, small changes, small refactoring. Take small steps.

4. Be very transparent about what you are doing at all times.


