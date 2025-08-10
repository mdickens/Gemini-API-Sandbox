Feature/bug list


1. 8.3.2025: fix remaining bugs in program: example: buttons that dont work : "Hint" , "Help", "Takeback" these buttons do nothing. "Flip Board" does not work as expected it should  put the opposite color at bottom of board from but it flips the pieces upside down... that is not expected. "Resign" does not work . these are bugs in player vs player  mode.    

2. 8.3.2025: add tests for all buttons and ensure that if new buttons are added or changed that tests are updated , added, or changed appropriately.

3. 8.10.25 Bug if using Takeback button a Draw by threefold repetition happens if the user takes back moves twice . Here is the failing sequence:  e2e3 -> Takeback ->e2e3 ->Takeback -> Unexpected: Game ends with "Draw by threefold repetition."

4. 8.10.25 Resign button does not work. Debug and fix Resign button. Start with adding a test case to confirm resign button does not work. Then fix it. Then use test case to verify it was fixed. 

5. 8.10.25 Help button does not work. Debug and fix Help butto Start with adding a test case to confirm Help button does not work. Then fix it. Then use test case to verify it was fixed. Make sure to add any newly created files to be tracked by git and commit them as well as any changed files.

6. CSS/Layout issue: "Player 1 (White)" overlaps "New Game" and "Flip Board" buttons. resolve layeout issue.   Debug and fix . If possible write a test case to check for overlapping layouts.  Then fix this specific layout issue. Then use test case to verify it was fixed. Make sure to add any newly created files to be tracked by git and commit them as well as any changed files.

