IMPORTANT: Development rules for the chess project. Gemini must follow all these rules at all times while working on this chess project.

1. Perform a git Commit after each change with: git commit -m '<<descriptive message>>'. There is no need to run git init or anything ,just git commit -m  '<<descriptive message>>' after each change.

1b. Just to clarify further rule #1: you must adopt a "commit-first" workflow. You must commit every change, even incremental ones, with a descriptive message explaining the step you are taking before running the tests to verify it. This goal is to create a transparent, step-by-step history of the work.

2. Test each change with node puppeteer.test.v2.js  to ensure no regressions. Use the puppeteer.test.v2.js test to create a direct feedback loop that can be used to test changes and iterate.

3. Before doing a major refactoring you must stop and discuss with your supervisor. In other words, the goal is to make steady forward progress versus going two steps forward and ten steps backward and then five steps forward and twenty steps backward, which is the pattern that your supervisor has observed over the past month. This is no longer acceptable. The goal is to steadily add and refine, add and refine, small changes, small steps, small improvements, small changes, small refactoring. Take small steps. Do not decide to completely change the architecture until there is some discussion with your supervisor. We have already been working on this project since July 6th 2025, so moving forward we need to take an additive and refining approach vs. the previously observed pattern of throwing out everything and starting from scratch over and over. The new pattern will favor adding to the project over removing from the project. For example if debug statements are added, instead of removing them when they are no longer needed, add another flag around the debug statements and set the flag to off so that the debug statement can be turned off. This is an additive approach vs. previous pattern observed which is add debug statements everywhere, then run tests, then delete debug statements everywhere. Remember: The approach is small incremental changes and additive over deletion. We will slowly make this program better over time by adding and refining . Deletion may be used if really needed but try to think if there is a way to use flags to turn off/on  or configure portions of code sections instead of just adding them and deleting them over and over. If after a change favor fixing the changes over rewriting tests.

4. Be very transparent about what you are doing at all times.

5. IMPORTANT: After every change commit and test. Do not forget to follow the process at all times.

6. Do NOT decide to refactor test suite completely because the tests are showing an error. If tests are failing, Do not assume that all the tests are broken first. First try to fix the errors that the tests are indicating the failure corresponds to. Especially if you just committed something and then the tests start to fail it is probably the new code that you just committed, not the tests themselves. It doesn not make sense to add a regression and then notice tests failing and decide to refactor the entire test suite. This is the pattern that Gemini has been doing over past few weeks and this is not acceptable. 


