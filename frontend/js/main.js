import { TicTacToe } from './tic-tac-toe.js';
import { AuthService } from './auth.js';

class App {
    constructor() {
        this.authService = new AuthService();
        this.game = null;
        this.currentUser = null;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        
        const user = await this.authService.checkAuth();
        if (user) {
            this.showGameInterface(user);
        } else {
            this.showAuthInterface();
        }
    }

    setupEventListeners() {
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
        document.getElementById('showRegister').addEventListener('click', this.showRegisterForm.bind(this));
        document.getElementById('showLogin').addEventListener('click', this.showLoginForm.bind(this));
        document.getElementById('logout-btn').addEventListener('click', this.handleLogout.bind(this));
        document.getElementById('save-game').addEventListener('click', this.handleSaveGame.bind(this));
        document.getElementById('view-history').addEventListener('click', this.handleViewHistory.bind(this));
    }

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const user = await this.authService.login(username, password);
            this.showGameInterface(user);
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const user = await this.authService.register(username, email, password);
            this.showGameInterface(user);
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    }

    async handleLogout() {
        await this.authService.logout();
        this.showAuthInterface();
    }

    async handleSaveGame() {
        if (this.game) {
            try {
                await this.game.saveGame();
                alert('Game saved successfully!');
            } catch (error) {
                alert('Failed to save game: ' + error.message);
            }
        }
    }

    async handleViewHistory() {
        try {
            const history = await this.authService.getGameHistory();
            this.displayGameHistory(history);
        } catch (error) {
            alert('Failed to load game history: ' + error.message);
        }
    }

    showRegisterForm(e) {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    }

    showLoginForm(e) {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    }

    showAuthInterface() {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('game-container').style.display = 'none';
        this.currentUser = null;
        if (this.game) {
            this.game.destroy();
            this.game = null;
        }
    }

    showGameInterface(user) {
        this.currentUser = user;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('username-display').textContent = `Welcome, ${user.username}!`;
        
        if (!this.game) {
            this.game = new TicTacToe(this.authService);
        }
    }

    displayGameHistory(history) {
        const historyHtml = history.games.map(game => `
            <div class="game-history-item">
                <p>Date: ${new Date(game.created_at).toLocaleString()}</p>
                <p>Winner: ${game.winner}</p>
                <p>Moves: ${game.moves}</p>
            </div>
        `).join('');
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Game History</h3>
                <div class="history-list">${historyHtml}</div>
                <button onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

new App();