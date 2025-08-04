export class TicTacToe {
    constructor(authService) {
        this.N_SIZE = 3;
        this.EMPTY = '&nbsp;';
        this.boxes = [];
        this.turn = 'X';
        this.score = {};
        this.moves = 0;
        this.authService = authService;
        this.gameBoard = [];
        
        this.init();
    }

    init() {
        const existingBoard = document.querySelector('#tictactoe table');
        if (existingBoard) {
            existingBoard.remove();
        }

        this.boxes = [];
        this.gameBoard = Array(9).fill('');
        
        const board = document.createElement('table');
        board.setAttribute('border', 1);
        board.setAttribute('cellspacing', 0);

        let identifier = 1;
        for (let i = 0; i < this.N_SIZE; i++) {
            const row = document.createElement('tr');
            board.appendChild(row);
            for (let j = 0; j < this.N_SIZE; j++) {
                const cell = document.createElement('td');
                cell.setAttribute('height', 120);
                cell.setAttribute('width', 120);
                cell.setAttribute('align', 'center');
                cell.setAttribute('valign', 'center');
                cell.classList.add('col' + j, 'row' + i);
                if (i === j) {
                    cell.classList.add('diagonal0');
                }
                if (j === this.N_SIZE - i - 1) {
                    cell.classList.add('diagonal1');
                }
                cell.identifier = identifier;
                cell.dataIndex = i * this.N_SIZE + j;
                cell.addEventListener('click', this.set.bind(this));
                row.appendChild(cell);
                this.boxes.push(cell);
                identifier += identifier;
            }
        }

        document.getElementById('tictactoe').appendChild(board);
        this.startNewGame();

        document.getElementById('theme-switch').addEventListener('change', function() {
            document.body.classList.toggle('dark', this.checked);
        });
    }

    startNewGame() {
        this.score = { 'X': 0, 'O': 0 };
        this.moves = 0;
        this.turn = 'X';
        this.gameBoard = Array(9).fill('');
        
        this.boxes.forEach(square => {
            square.innerHTML = this.EMPTY;
            square.classList.remove('x', 'o', 'win');
        });
        
        document.getElementById('turn').textContent = 'Player ' + this.turn;
    }

    win(clicked) {
        const memberOf = clicked.className.split(/\s+/);
        for (const className of memberOf) {
            const testClass = '.' + className;
            const items = this.contains('#tictactoe ' + testClass, this.turn);
            if (items.length === this.N_SIZE) {
                items.forEach(item => item.classList.add('win'));
                return true;
            }
        }
        return false;
    }

    contains(selector, text) {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).filter(element => RegExp(text).test(element.textContent));
    }

    set(event) {
        const cell = event.target;
        
        if (cell.innerHTML !== this.EMPTY) {
            return;
        }
        
        cell.innerHTML = this.turn;
        cell.classList.add(this.turn.toLowerCase());
        this.gameBoard[cell.dataIndex] = this.turn;
        this.moves += 1;
        this.score[this.turn] += cell.identifier;
        
        if (this.win(cell)) {
            alert('Winner: Player ' + this.turn);
            this.startNewGame();
        } else if (this.moves === this.N_SIZE * this.N_SIZE) {
            alert('Draw');
            this.startNewGame();
        } else {
            this.turn = this.turn === 'X' ? 'O' : 'X';
            document.getElementById('turn').textContent = 'Player ' + this.turn;
        }
    }

    async saveGame() {
        if (this.moves === 0) {
            throw new Error('No moves to save');
        }

        const gameData = {
            board: this.gameBoard,
            winner: this.getWinner(),
            moves: this.moves
        };

        return await this.authService.saveGame(gameData);
    }

    getWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.gameBoard[a] && 
                this.gameBoard[a] === this.gameBoard[b] && 
                this.gameBoard[a] === this.gameBoard[c]) {
                return this.gameBoard[a];
            }
        }

        return this.moves === 9 ? 'Draw' : null;
    }

    destroy() {
        const board = document.querySelector('#tictactoe table');
        if (board) {
            board.remove();
        }
        this.boxes = [];
    }
}