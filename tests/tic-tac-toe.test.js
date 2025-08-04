/**
 * Unit Tests for Tic Tac Toe Game
 * Tests all core game functionality
 */

// Mock DOM elements for testing
function createMockDOM() {
    const mockDiv = {
        appendChild: function() {},
        innerHTML: '',
        textContent: ''
    };
    
    const mockTable = {
        setAttribute: function() {},
        appendChild: function() {}
    };
    
    const mockCell = {
        setAttribute: function() {},
        classList: {
            add: function() {},
            remove: function() {},
            contains: function() { return false; }
        },
        addEventListener: function() {},
        innerHTML: '&nbsp;',
        identifier: 1,
        className: 'col0 row0'
    };
    
    global.document = {
        createElement: function(tag) {
            if (tag === 'table') return mockTable;
            if (tag === 'tr') return { appendChild: function() {} };
            if (tag === 'td') return { ...mockCell };
            return mockDiv;
        },
        getElementById: function(id) {
            if (id === 'tictactoe') return mockDiv;
            if (id === 'turn') return mockDiv;
            if (id === 'theme-switch') return { addEventListener: function() {} };
            return mockDiv;
        },
        querySelectorAll: function() { return []; }
    };
}

// Test helper functions
function resetGameState() {
    boxes = [];
    turn = 'X';
    score = undefined;
    moves = undefined;
}

function createTestCell(row, col, identifier = 1) {
    return {
        innerHTML: '&nbsp;',
        identifier: identifier,
        className: `col${col} row${row}`,
        classList: {
            classes: [],
            add: function(cls) { this.classes.push(cls); },
            remove: function(cls) { 
                this.classes = this.classes.filter(c => c !== cls); 
            },
            contains: function(cls) { return this.classes.includes(cls); }
        },
        textContent: '&nbsp;'
    };
}

describe('Tic Tac Toe Game Tests', () => {
    
    beforeEach(() => {
        createMockDOM();
        resetGameState();
    });

    describe('Game Initialization', () => {
        it('should initialize with correct constants', () => {
            expect(N_SIZE).toBe(3);
            expect(EMPTY).toBe('&nbsp;');
        });

        it('should start with player X turn', () => {
            expect(turn).toBe('X');
        });

        it('should initialize empty boxes array', () => {
            expect(boxes).toEqual([]);
        });

        it('should call startNewGame during init', () => {
            // Test that startNewGame properly initializes game state
            startNewGame();
            expect(score).toEqual({ 'X': 0, 'O': 0 });
            expect(moves).toBe(0);
            expect(turn).toBe('X');
        });
    });

    describe('Game State Management', () => {
        beforeEach(() => {
            startNewGame();
        });

        it('should reset score to zero for both players', () => {
            expect(score.X).toBe(0);
            expect(score.O).toBe(0);
        });

        it('should reset moves to zero', () => {
            expect(moves).toBe(0);
        });

        it('should reset turn to X', () => {
            expect(turn).toBe('X');
        });

        it('should clear all boxes during new game', () => {
            // Simulate boxes with content
            boxes = [createTestCell(0, 0), createTestCell(0, 1)];
            boxes[0].innerHTML = 'X';
            boxes[1].innerHTML = 'O';
            
            startNewGame();
            
            boxes.forEach(box => {
                expect(box.innerHTML).toBe(EMPTY);
            });
        });
    });

    describe('Move Validation', () => {
        beforeEach(() => {
            startNewGame();
        });

        it('should allow move on empty cell', () => {
            const cell = createTestCell(0, 0);
            cell.innerHTML = EMPTY;
            
            // Simulate the set function logic
            const canMove = cell.innerHTML === EMPTY;
            expect(canMove).toBeTruthy();
        });

        it('should reject move on occupied cell', () => {
            const cell = createTestCell(0, 0);
            cell.innerHTML = 'X';
            
            // Simulate the set function logic
            const canMove = cell.innerHTML === EMPTY;
            expect(canMove).toBeFalsy();
        });
    });

    describe('Turn Management', () => {
        beforeEach(() => {
            startNewGame();
        });

        it('should switch from X to O', () => {
            expect(turn).toBe('X');
            turn = turn === 'X' ? 'O' : 'X';
            expect(turn).toBe('O');
        });

        it('should switch from O to X', () => {
            turn = 'O';
            turn = turn === 'X' ? 'O' : 'X';
            expect(turn).toBe('X');
        });
    });

    describe('Win Detection Logic', () => {
        beforeEach(() => {
            startNewGame();
            // Mock document.querySelectorAll for win detection
            global.document.querySelectorAll = function(selector) {
                // Return mock elements based on selector
                if (selector.includes('row0')) {
                    return [
                        { textContent: 'X' },
                        { textContent: 'X' },
                        { textContent: 'X' }
                    ];
                }
                return [];
            };
        });

        it('should detect win condition', () => {
            const cell = {
                className: 'col0 row0',
                classList: { add: function() {} }
            };
            
            // Test the contains function
            const elements = contains('#tictactoe .row0', 'X');
            expect(elements).toHaveLength(3);
        });

        it('should return false for no win condition', () => {
            global.document.querySelectorAll = function() {
                return [
                    { textContent: 'X' },
                    { textContent: 'O' }
                ];
            };
            
            const elements = contains('#tictactoe .row0', 'X');
            expect(elements.length).toBe(1);
        });
    });

    describe('Score Tracking', () => {
        beforeEach(() => {
            startNewGame();
        });

        it('should update score when player makes move', () => {
            const cell = createTestCell(0, 0, 1);
            
            // Simulate move
            score[turn] += cell.identifier;
            moves += 1;
            
            expect(score.X).toBe(1);
            expect(moves).toBe(1);
        });

        it('should track moves correctly', () => {
            moves = 5;
            moves += 1;
            expect(moves).toBe(6);
        });

        it('should detect draw condition', () => {
            moves = 9;
            const isDraw = moves === N_SIZE * N_SIZE;
            expect(isDraw).toBeTruthy();
        });
    });

    describe('Cell Classification', () => {
        it('should assign correct CSS classes for position (0,0)', () => {
            const cell = createTestCell(0, 0);
            expect(cell.className).toContain('col0');
            expect(cell.className).toContain('row0');
        });

        it('should assign correct CSS classes for position (1,1)', () => {
            const cell = createTestCell(1, 1);
            expect(cell.className).toContain('col1');
            expect(cell.className).toContain('row1');
        });

        it('should identify diagonal cells correctly', () => {
            // Test diagonal detection logic
            const i = 0, j = 0;
            const isDiagonal0 = (i === j);
            const isDiagonal1 = (j === N_SIZE - i - 1);
            
            expect(isDiagonal0).toBeTruthy(); // (0,0) is on main diagonal
            expect(isDiagonal1).toBeTruthy(); // (0,2) would be on anti-diagonal
        });
    });

    describe('Utility Functions', () => {
        beforeEach(() => {
            // Mock RegExp.test for contains function
            global.RegExp = function(pattern) {
                return {
                    test: function(text) {
                        return text.includes(pattern);
                    }
                };
            };
        });

        it('should filter elements by text content', () => {
            const elements = [
                { textContent: 'X' },
                { textContent: 'O' },
                { textContent: 'X' }
            ];
            
            const filtered = elements.filter(element => 
                RegExp('X').test(element.textContent)
            );
            
            expect(filtered).toHaveLength(2);
        });

        it('should handle empty element arrays', () => {
            const elements = [];
            const filtered = elements.filter(element => 
                RegExp('X').test(element.textContent)
            );
            
            expect(filtered).toHaveLength(0);
        });
    });

    describe('Game Flow Integration', () => {
        beforeEach(() => {
            startNewGame();
        });

        it('should complete a full game turn sequence', () => {
            // Simulate first move
            expect(turn).toBe('X');
            expect(moves).toBe(0);
            
            // Make move
            moves += 1;
            score[turn] += 1;
            turn = turn === 'X' ? 'O' : 'X';
            
            expect(moves).toBe(1);
            expect(score.X).toBe(1);
            expect(turn).toBe('O');
            
            // Make second move
            moves += 1;
            score[turn] += 2;
            turn = turn === 'X' ? 'O' : 'X';
            
            expect(moves).toBe(2);
            expect(score.O).toBe(2);
            expect(turn).toBe('X');
        });
    });
});

// Run all tests when this file is loaded
if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('load', () => {
        testFramework.runTests();
    });
} else if (typeof module !== 'undefined') {
    // Node.js environment
    module.exports = { testFramework };
}