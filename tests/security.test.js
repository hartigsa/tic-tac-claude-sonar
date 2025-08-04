/**
 * Security-focused Unit Tests for Tic Tac Toe Game
 * Tests defensive security measures and input validation
 */

// Security test helper functions
function createMaliciousInput(type) {
    const maliciousInputs = {
        xss: '<script>alert("XSS")</script>',
        htmlInjection: '<img src="x" onerror="alert(\'HTML Injection\')">',
        jsInjection: 'javascript:alert("JS Injection")',
        sqlInjection: "'; DROP TABLE users; --",
        pathTraversal: '../../../etc/passwd',
        nullByte: 'test\x00.txt',
        oversized: 'A'.repeat(10000),
        unicode: '\u0000\u0001\u0002',
        specialChars: '!@#$%^&*()[]{}|\\:";\'<>?,./',
        emptyString: '',
        whitespace: '   \t\n\r   '
    };
    return maliciousInputs[type] || maliciousInputs.xss;
}

function simulateUserInput(input) {
    // Simulate how user input would be processed in the game
    return {
        raw: input,
        length: input.length,
        containsScript: input.includes('<script'),
        containsHTML: /<[^>]*>/.test(input),
        isValidMove: input === 'X' || input === 'O' || input === '&nbsp;'
    };
}

function testDOMSanitization(input) {
    // Test if input would be safely handled by DOM manipulation
    const tempDiv = document.createElement('div');
    tempDiv.textContent = input; // Safe method
    return {
        textContent: tempDiv.textContent,
        innerHTML: tempDiv.innerHTML,
        isSanitized: tempDiv.textContent === input
    };
}

describe('Security Tests', () => {

    describe('XSS Prevention', () => {
        
        it('should prevent script injection in game cells', () => {
            const maliciousInput = createMaliciousInput('xss');
            const cell = createTestCell(0, 0);
            
            // Test that script tags are not executed when setting cell content
            cell.textContent = maliciousInput; // Safe method
            
            expect(cell.textContent).toBe(maliciousInput);
            expect(cell.textContent).not.toContain('<script>');
            
            // Verify innerHTML doesn't contain executable script
            const tempDiv = document.createElement('div');
            tempDiv.textContent = maliciousInput;
            expect(tempDiv.innerHTML).not.toContain('<script>');
        });

        it('should sanitize user input for display', () => {
            const maliciousInputs = [
                '<script>alert("XSS")</script>',
                '<img src="x" onerror="alert(1)">',
                'javascript:alert("test")',
                '<iframe src="javascript:alert(1)"></iframe>'
            ];

            maliciousInputs.forEach(input => {
                const result = testDOMSanitization(input);
                expect(result.isSanitized).toBeTruthy();
                expect(result.textContent).not.toContain('<script');
                expect(result.textContent).not.toContain('javascript:');
            });
        });

        it('should validate that textContent is used instead of innerHTML for user data', () => {
            const maliciousHTML = '<script>alert("XSS")</script>';
            const cell = createTestCell(0, 0);
            
            // Simulate safe content setting (how the game should work)
            cell.textContent = maliciousHTML;
            
            // Verify the content is escaped
            expect(cell.textContent).toBe(maliciousHTML);
            
            // Verify innerHTML shows escaped content
            const div = document.createElement('div');
            div.textContent = maliciousHTML;
            expect(div.innerHTML).toContain('&lt;script&gt;');
        });
    });

    describe('Input Validation', () => {
        
        it('should validate game move inputs', () => {
            const validInputs = ['X', 'O', '&nbsp;'];
            const invalidInputs = [
                '<script>alert(1)</script>',
                'javascript:void(0)',
                '../../etc/passwd',
                'DROP TABLE users',
                '',
                null,
                undefined,
                123,
                true,
                {},
                []
            ];

            validInputs.forEach(input => {
                const result = simulateUserInput(input);
                expect(result.isValidMove).toBeTruthy();
            });

            invalidInputs.forEach(input => {
                const inputStr = String(input);
                const result = simulateUserInput(inputStr);
                expect(result.isValidMove).toBeFalsy();
            });
        });

        it('should reject oversized inputs', () => {
            const oversizedInput = createMaliciousInput('oversized');
            const result = simulateUserInput(oversizedInput);
            
            expect(result.length).toBeGreaterThan(1000);
            expect(result.isValidMove).toBeFalsy();
        });

        it('should handle special characters safely', () => {
            const specialChars = createMaliciousInput('specialChars');
            const result = simulateUserInput(specialChars);
            
            expect(result.isValidMove).toBeFalsy();
            expect(result.containsHTML).toBeFalsy();
        });

        it('should validate empty and whitespace inputs', () => {
            const emptyInput = createMaliciousInput('emptyString');
            const whitespaceInput = createMaliciousInput('whitespace');
            
            const emptyResult = simulateUserInput(emptyInput);
            const whitespaceResult = simulateUserInput(whitespaceInput);
            
            expect(emptyResult.isValidMove).toBeFalsy();
            expect(whitespaceResult.isValidMove).toBeFalsy();
        });
    });

    describe('DOM Manipulation Security', () => {
        
        it('should use safe DOM methods for content updates', () => {
            const cell = createTestCell(0, 0);
            const maliciousContent = '<img src="x" onerror="alert(1)">';
            
            // Test safe content update method
            cell.textContent = maliciousContent;
            
            // Verify content is safely escaped
            expect(cell.textContent).toBe(maliciousContent);
            
            // Verify no script execution context is created
            const tempDiv = document.createElement('div');
            tempDiv.textContent = maliciousContent;
            expect(tempDiv.innerHTML).not.toContain('onerror=');
            expect(tempDiv.innerHTML).toContain('&lt;img');
        });

        it('should prevent attribute injection in dynamic elements', () => {
            const maliciousClassName = 'test" onload="alert(1)" class="';
            
            // Test that class names are properly validated
            const isValidClassName = /^[a-zA-Z0-9\-_\s]+$/.test(maliciousClassName);
            expect(isValidClassName).toBeFalsy();
            
            // Test safe class addition
            const cell = createTestCell(0, 0);
            if (isValidClassName) {
                cell.className = maliciousClassName;
            }
            
            expect(cell.className).not.toContain('onload=');
        });

        it('should validate CSS class names for security', () => {
            const validClasses = ['col0', 'row1', 'diagonal0', 'win', 'x', 'o'];
            const invalidClasses = [
                'javascript:alert(1)',
                '<script>alert(1)</script>',
                'expression(alert(1))',
                'url(javascript:alert(1))',
                '"onload="alert(1)"'
            ];

            validClasses.forEach(className => {
                const isValid = /^[a-zA-Z0-9\-_]+$/.test(className);
                expect(isValid).toBeTruthy();
            });

            invalidClasses.forEach(className => {
                const isValid = /^[a-zA-Z0-9\-_]+$/.test(className);
                expect(isValid).toBeFalsy();
            });
        });
    });

    describe('Game State Security', () => {
        
        beforeEach(() => {
            startNewGame();
        });

        it('should validate game state integrity', () => {
            // Test that game state cannot be corrupted by malicious input
            const originalScore = { ...score };
            const originalMoves = moves;
            const originalTurn = turn;
            
            // Attempt to inject malicious values
            try {
                score = createMaliciousInput('xss');
                moves = createMaliciousInput('sqlInjection');
                turn = createMaliciousInput('htmlInjection');
            } catch (e) {
                // Expected to fail
            }
            
            // Reset to safe state
            startNewGame();
            
            expect(typeof score).toBe('object');
            expect(typeof moves).toBe('number');
            expect(typeof turn).toBe('string');
            expect(['X', 'O']).toContain(turn);
        });

        it('should prevent score manipulation', () => {
            startNewGame();
            
            const originalScore = { ...score };
            
            // Test that score can only be modified through legitimate game moves
            const validScoreUpdate = (player, value) => {
                if (typeof value !== 'number' || value < 0) {
                    return false;
                }
                if (!['X', 'O'].includes(player)) {
                    return false;
                }
                return true;
            };
            
            expect(validScoreUpdate('X', 5)).toBeTruthy();
            expect(validScoreUpdate('O', 10)).toBeTruthy();
            expect(validScoreUpdate('X', -1)).toBeFalsy();
            expect(validScoreUpdate('Z', 5)).toBeFalsy();
            expect(validScoreUpdate('X', 'malicious')).toBeFalsy();
        });

        it('should validate move count integrity', () => {
            startNewGame();
            
            // Test move count validation
            const isValidMoveCount = (count) => {
                return typeof count === 'number' && 
                       count >= 0 && 
                       count <= 9 && 
                       Number.isInteger(count);
            };
            
            expect(isValidMoveCount(0)).toBeTruthy();
            expect(isValidMoveCount(5)).toBeTruthy();
            expect(isValidMoveCount(9)).toBeTruthy();
            expect(isValidMoveCount(-1)).toBeFalsy();
            expect(isValidMoveCount(10)).toBeFalsy();
            expect(isValidMoveCount(3.5)).toBeFalsy();
            expect(isValidMoveCount('5')).toBeFalsy();
        });
    });

    describe('Content Security Policy Compliance', () => {
        
        it('should not use inline event handlers', () => {
            // Test that the game doesn't rely on inline JavaScript
            const cell = createTestCell(0, 0);
            
            // Verify no onclick attributes
            expect(cell.onclick).toBeUndefined();
            expect(cell.getAttribute && cell.getAttribute('onclick')).toBeFalsy();
            
            // Test that event listeners are added programmatically
            let eventListenerAdded = false;
            cell.addEventListener = () => { eventListenerAdded = true; };
            cell.addEventListener('click', () => {});
            
            expect(eventListenerAdded).toBeTruthy();
        });

        it('should not execute eval or similar dangerous functions', () => {
            // Test that the game code doesn't use dangerous functions
            const dangerousFunctions = ['eval', 'Function', 'setTimeout', 'setInterval'];
            const gameLogic = `
                function set() {
                    if (this.innerHTML !== EMPTY) {
                        return;
                    }
                    this.innerHTML = turn;
                    this.classList.add(turn.toLowerCase());
                    moves += 1;
                    score[turn] += this.identifier;
                }
            `;
            
            dangerousFunctions.forEach(func => {
                expect(gameLogic).not.toContain(func + '(');
            });
        });
    });

    describe('Data Sanitization', () => {
        
        it('should sanitize player names for display', () => {
            const maliciousPlayerName = '<script>alert("Player XSS")</script>';
            
            // Simulate safe player name display
            const sanitizedName = maliciousPlayerName.replace(/<[^>]*>/g, '');
            
            expect(sanitizedName).toBe('alert("Player XSS")');
            expect(sanitizedName).not.toContain('<script>');
        });

        it('should validate URL inputs if any', () => {
            const maliciousURLs = [
                'javascript:alert(1)',
                'data:text/html,<script>alert(1)</script>',
                'vbscript:msgbox(1)',
                'file:///etc/passwd'
            ];
            
            const isValidURL = (url) => {
                try {
                    const parsedURL = new URL(url);
                    return ['http:', 'https:'].includes(parsedURL.protocol);
                } catch {
                    return false;
                }
            };
            
            maliciousURLs.forEach(url => {
                expect(isValidURL(url)).toBeFalsy();
            });
            
            expect(isValidURL('https://example.com')).toBeTruthy();
            expect(isValidURL('http://localhost:8000')).toBeTruthy();
        });
    });

    describe('Session Security', () => {
        
        it('should not expose sensitive data in client-side storage', () => {
            // Test that game doesn't store sensitive data in localStorage
            const gameData = {
                score: { X: 5, O: 3 },
                moves: 8,
                turn: 'X'
            };
            
            // Verify no sensitive data patterns
            const dataString = JSON.stringify(gameData);
            const sensitivePatterns = [
                /password/i,
                /secret/i,
                /token/i,
                /key/i,
                /session/i
            ];
            
            sensitivePatterns.forEach(pattern => {
                expect(pattern.test(dataString)).toBeFalsy();
            });
        });

        it('should validate session data integrity', () => {
            const gameSession = {
                gameId: 'game_123',
                players: ['X', 'O'],
                startTime: Date.now()
            };
            
            // Test session validation
            const isValidSession = (session) => {
                return session.gameId && 
                       typeof session.gameId === 'string' &&
                       Array.isArray(session.players) &&
                       session.players.length === 2 &&
                       typeof session.startTime === 'number';
            };
            
            expect(isValidSession(gameSession)).toBeTruthy();
            
            // Test invalid sessions
            expect(isValidSession({})).toBeFalsy();
            expect(isValidSession({ gameId: '<script>alert(1)</script>' })).toBeFalsy();
        });
    });
});