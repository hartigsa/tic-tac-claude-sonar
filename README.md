# Tic Tac Toe

**A basic Tic Tac Toe game built using HTML, JavaScript, and CSS. No dependencies required.**

[![View The Demo](https://www.mtb.com/personal/onlineservices/PublishingImages/alt-banking-button-view-demo-cs5452.jpg)](http://codepen.io/vasanthkay/pen/KVzYzG?editors=001)

## Running the Game

### Option 1: Simple Vanilla Version (No dependencies)

```bash
# Open in browser directly
open index.html
# or on Windows
start index.html
# or serve with Python
python -m http.server 8000
# or with Node.js
npx serve .
```

### Option 2: Full Stack Version with Docker

For the complete application with user authentication and persistent storage:

```bash
# Start the full application stack
docker-compose up --build

# Access the application:
# - Frontend: http://localhost:5173
# - Backend API: http://localhost:3000
# - Database: localhost:5432
```

**See [README-Docker.md](README-Docker.md) for complete Docker setup instructions, security features, and API documentation.**

## Running the Tests

The project includes comprehensive unit tests for all game functionality:

```bash
# Option 1: Open test runner directly in browser
start tests/test-runner.html
# or on macOS/Linux
open tests/test-runner.html

# Option 2: Serve with local server and navigate to tests
python -m http.server 8000
# then open http://localhost:8000/tests/test-runner.html

# Option 3: Using Node.js serve
npx serve .
# then open http://localhost:3000/tests/test-runner.html
```

The test suite includes:
- Game initialization and state management tests
- Move validation and turn switching tests  
- Win detection algorithm tests
- Score tracking and game flow tests
- DOM interaction simulation tests
- **🔒 Security Tests:**
  - XSS prevention and input sanitization
  - DOM manipulation security validation
  - Input validation and bounds checking
  - Game state integrity protection
  - Content Security Policy compliance testing
  - HTTP security headers validation
  - Rate limiting and DoS protection
  - CSRF protection and session security
  - Secure error handling and data storage

### Security Testing Features

The comprehensive security test suite implements defensive security validation:

- **`tests/security.test.js`**: Core security tests for XSS prevention, input validation, DOM security, and state protection
- **`tests/security-headers.test.js`**: Advanced security tests for HTTP headers, rate limiting, CSRF protection, and secure session management
- **`SECURITY-CHECKLIST.md`**: Complete security audit checklist with implementation status and recommendations

**Key Security Features Tested:**
- **XSS Prevention**: Script injection, HTML injection, and malicious event handler protection
- **Input Validation**: Whitelist validation, oversized input rejection, special character handling
- **DOM Security**: Safe manipulation using `textContent`, attribute injection prevention
- **State Protection**: Game state integrity, score manipulation prevention, session security
- **Headers Security**: CSP validation, security headers compliance, clickjacking prevention
- **Rate Limiting**: DoS protection simulation, rapid request detection
- **Data Security**: Secure storage validation, error information leakage prevention

## How to Play
1. To make a move, the player will use a single mouse click to mark a space. In this version, there is no provision to undo a move. Once a move is made, the game proceeds to the next player's turn.
2. At each move, the game will indicate whose turn (Player A or Player B) it is. When the game ends, it displays one of the following outcomes:
   * Winner: Player A
   * Winner: Player B
   * Draw