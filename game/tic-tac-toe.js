/**
 * Tic Tac Toe
 *
 * A Tic Tac Toe game in HTML/JavaScript/CSS.
 *
 * No dependencies - Uses Vanilla JS
 *
 * @author: Vasanth Krishnamoorthy
 * @co-author: Akshat Singh Kushwaha 
 */
const N_SIZE = 3;
const EMPTY = '&nbsp;';
let boxes = [];
let turn = 'X';
let score;
let moves;

function init() {
    const board = document.createElement('table');
    board.className = 'game-board';

    let identifier = 1;
    for (let i = 0; i < N_SIZE; i++) {
        const row = document.createElement('tr');
        board.appendChild(row);
        for (let j = 0; j < N_SIZE; j++) {
            const cell = document.createElement('td');
            cell.className = 'game-cell';
            cell.classList.add('col' + j, 'row' + i);
            if (i === j) {
                cell.classList.add('diagonal0');
            }
            if (j === N_SIZE - i - 1) {
                cell.classList.add('diagonal1');
            }
            cell.identifier = identifier;
            cell.addEventListener('click', set);
            row.appendChild(cell);
            boxes.push(cell);
            identifier++;
        }
    }

    document.getElementById('tictactoe').appendChild(board);
    startNewGame();
}

function startNewGame() {
    score = { 'X': 0, 'O': 0 };
    moves = 0;
    turn = 'X';
    boxes.forEach(square => {
        square.textContent = '';
        square.classList.remove('x', 'o');
    });
    document.getElementById('turn').textContent = 'Player ' + turn;
}

function win(clicked) {
    const memberOf = clicked.className.split(/\s+/);
    for (const className of memberOf) {
        const testClass = '.' + className;
        const items = contains('#tictactoe ' + testClass, turn);
        if (items.length === N_SIZE) {
            items.forEach(item => item.classList.add('win'));
            return true;
        }
    }
    return false;
}

function contains(selector, text) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).filter(element => RegExp(text).test(element.textContent));
}

function set() {
    if (this.textContent.trim() !== '') {
        return;
    }
    this.textContent = turn;
    this.classList.add(turn.toLowerCase());
    moves += 1;
    score[turn] += this.identifier;
    if (win(this)) {
        showGameResult('Winner: Player ' + turn);
        setTimeout(startNewGame, 2000);
    } else if (moves === N_SIZE * N_SIZE) {
        showGameResult('Draw');
        setTimeout(startNewGame, 2000);
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        document.getElementById('turn').textContent = 'Player ' + turn;
    }
}

function showGameResult(message) {
    const resultElement = document.getElementById('game-result');
    if (resultElement) {
        resultElement.textContent = message;
        resultElement.style.display = 'block';
        setTimeout(() => {
            resultElement.style.display = 'none';
        }, 1500);
    }
}

function safeInit() {
    try {
        const container = document.getElementById('tictactoe');
        if (!container) {
            console.error('Game container not found');
            return;
        }
        init();
    } catch (error) {
        console.error('Failed to initialize game:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
} else {
    safeInit();
}

// Theme toggle with error handling
const themeSwitch = document.getElementById('theme-switch');
if (themeSwitch) {
    themeSwitch.addEventListener('change', function() {
        document.body.classList.toggle('dark', this.checked);
    });
}
