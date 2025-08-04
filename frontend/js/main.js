import { TicTacToe } from './tic-tac-toe.js';
import { AuthService } from './auth.js';

class App {
    constructor() {
        this.authService = new AuthService();
        this.game = null;
        this.currentUser = null;
    }

    async init() {
        this.setupEventListeners();
        
        try {
            const user = await this.authService.checkAuth();
            if (user) {
                this.showGameInterface(user);
            } else {
                this.showAuthInterface();
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showAuthInterface();
        }
    }

    static async create() {
        const app = new App();
        await app.init();
        return app;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #f5c6cb;';
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = 'background: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #c3e6cb;';
        
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(successDiv, container.firstChild);
        
        setTimeout(() => successDiv.remove(), 3000);
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
            this.showError('Login failed: ' + error.message);
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
            this.showError('Registration failed: ' + error.message);
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
                this.showSuccess('Game saved successfully!');
            } catch (error) {
                this.showError('Failed to save game: ' + error.message);
            }
        }
    }

    async handleViewHistory() {
        try {
            const history = await this.authService.getGameHistory();
            this.displayGameHistory(history);
        } catch (error) {
            this.showError('Failed to load game history: ' + error.message);
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
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const title = document.createElement('h3');
        title.textContent = 'Game History';
        
        const historyList = document.createElement('div');
        historyList.className = 'history-list';
        
        history.games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-history-item';
            
            const dateP = document.createElement('p');
            dateP.textContent = `Date: ${new Date(game.created_at).toLocaleString()}`;
            
            const winnerP = document.createElement('p');
            winnerP.textContent = `Winner: ${game.winner}`;
            
            const movesP = document.createElement('p');
            movesP.textContent = `Moves: ${game.moves}`;
            
            gameItem.appendChild(dateP);
            gameItem.appendChild(winnerP);
            gameItem.appendChild(movesP);
            historyList.appendChild(gameItem);
        });
        
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', () => {
            modal.remove();
        });
        
        modalContent.appendChild(title);
        modalContent.appendChild(historyList);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);
        
        document.body.appendChild(modal);
    }
}

App.create().catch(error => {
    console.error('Failed to create app:', error);
});