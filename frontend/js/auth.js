import axios from 'axios';

export class AuthService {
    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        this.api = axios.create({
            baseURL: this.apiUrl,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    async login(username, password) {
        try {
            const response = await this.api.post('/api/auth/login', {
                username: this.sanitizeInput(username),
                password
            });
            return response.data.user;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    }

    async register(username, email, password) {
        try {
            const response = await this.api.post('/api/auth/register', {
                username: this.sanitizeInput(username),
                email: this.sanitizeInput(email),
                password
            });
            return response.data.user;
        } catch (error) {
            const errorMsg = error.response?.data?.errors?.[0]?.msg || 
                           error.response?.data?.error || 
                           'Registration failed';
            throw new Error(errorMsg);
        }
    }

    async logout() {
        try {
            await this.api.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async checkAuth() {
        try {
            const response = await this.api.get('/api/auth/me');
            return response.data.user;
        } catch (error) {
            return null;
        }
    }

    async saveGame(gameData) {
        try {
            const response = await this.api.post('/api/game/save', {
                board: gameData.board,
                winner: gameData.winner,
                moves: gameData.moves
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to save game');
        }
    }

    async getGameHistory(page = 1, limit = 10) {
        try {
            const response = await this.api.get(`/api/game/history?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get game history');
        }
    }

    async getGameStats() {
        try {
            const response = await this.api.get('/api/game/stats');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Failed to get game stats');
        }
    }

    sanitizeInput(input) {
        return input.trim().replace(/[<>\"'&]/g, '');
    }
}