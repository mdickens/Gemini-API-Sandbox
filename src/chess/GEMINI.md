IMPORTANT: Development rules for the chess project. Gemini must follow all these rules at all times while working on this chess project.
   1. Commit after each change: Perform a git commit -m '<<descriptive message>>' after every change.
   2. Commit-first workflow: Adopt a "commit-first" workflow, committing every change with a descriptive message explaining the step taken.
   3. Test after each commit: Test each change with node puppeteer.test.v2.js to ensure no regressions.
   3a. For first run of tests to preserve tokens run it like this node puppeteer.test.v2.js | grep "Tests finished.*" , if tests pass this will save tokens
   3b. If the the test failed for 3a, then you can run the test again to get more details: node puppeteer.test.v2.js
   4. No major refactoring without discussion: Avoid major refactoring and focus on small, incremental, and additive changes.
   5. Transparency: Be transparent about what you are doing at all times.
   6. Commit and test: After every change, commit and test. Do not forget to follow the process.
   7. Don't refactor failing tests: If tests are failing, fix the code that caused the failure, don't refactor the entire test suite.
   8. Wait for instructions: Do not start working until told to start development work.
   9. Standardized Commit Messages: All commit messages must follow the Conventional Commits specification (e.g., feat:, fix:, docs:, style:, refactor:, test:, chore:).
   10. Feature Branching: All new work must be done on a dedicated feature branch created from the main branch (e.g., git checkout -b feat/add-new-piece).
   11. Code Commenting for Complexity: Add comments to explain why a complex or non-obvious piece of code exists. Do not comment on what the code is doing if it's
       self-explanatory.
   12. Update Documentation with Code: If a code change alters a feature or adds a new one, the corresponding documentation (e.g., README.md) must be updated in the same commit.
   13. Dependency Approval: Before adding any new third-party library (npm install <package>), you must get approval from the supervisor.
   14. Write Tests for New Features: Any new feature or function must be accompanied by a corresponding test that verifies its correctness.
   15. Error Handling: All functions that can potentially fail (e.g., I/O, network requests) must have explicit error handling (e.g., try-catch blocks, promises with .catch()).
   16. Report Test Results: After running the tests, explicitly state whether they passed or failed. If they failed, provide the error output.


