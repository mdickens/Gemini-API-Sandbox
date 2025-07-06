import { pieceUnicode } from './board.js';
import { whiteCaptured, blackCaptured, whiteTurn } from './game.js';

export function updateCapturedPanels() {
    const whiteCapturedPanel = document.getElementById('white-captured');
    const blackCapturedPanel = document.getElementById('black-captured');
    whiteCapturedPanel.innerHTML = '';
    blackCapturedPanel.innerHTML = '';

    whiteCaptured.forEach(piece => {
        const pieceElement = document.createElement('span');
        pieceElement.classList.add('piece');
        pieceElement.textContent = pieceUnicode[piece];
        whiteCapturedPanel.appendChild(pieceElement);
    });

    blackCaptured.forEach(piece => {
        const pieceElement = document.createElement('span');
        pieceElement.classList.add('piece');
        pieceElement.textContent = pieceUnicode[piece];
        blackCapturedPanel.appendChild(pieceElement);
    });
}

export function highlightValidMoves(startRow, startCol, isValidMove) {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (isValidMove(startRow, startCol, row, col)) {
                const square = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                if (square) {
                    square.classList.add('valid-move');
                }
            }
        }
    }
}

export function clearHighlights() {
    const highlightedSquares = document.querySelectorAll('.valid-move');
    highlightedSquares.forEach(square => square.classList.remove('valid-move'));
}

export function updateTimers(whiteTime, blackTime) {
    const whiteTimerDisplay = document.getElementById('white-timer');
    const blackTimerDisplay = document.getElementById('black-timer');
    whiteTimerDisplay.textContent = formatTime(whiteTime);
    blackTimerDisplay.textContent = formatTime(blackTime);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
