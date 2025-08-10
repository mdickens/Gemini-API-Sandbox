Feature/bug list


1. 8.3.2025: fix remaining bugs in program: example: buttons that dont work : "Hint" , "Help", "Takeback" these buttons do nothing. "Flip Board" does not work as expected it should  put the opposite color at bottom of board from but it flips the pieces upside down... that is not expected. "Resign" does not work . these are bugs in player vs player  mode.    

2. 8.3.2025: add tests for all buttons and ensure that if new buttons are added or changed that tests are updated , added, or changed appropriately.

3. Bug if using Takeback button a Draw by threefold repetition happens if the user takes back moves twice . Here is the failing sequence:  e2e3 -> Takeback ->e2e3 ->Takeback -> Unexpected: Game ends with "Draw by threefold repetition."

4. Resign button does not work. Debug and fix Resign button

5. Help button does not work. Debug and fix Help button

6. CSS/Layout issue: "Player 1 (White)" overlaps "New Game" and "Flip Board" buttons. resolve layeout issue

