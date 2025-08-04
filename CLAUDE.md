# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a vanilla JavaScript Tic Tac Toe game with no build process or dependencies. The project consists of:

- **index.html**: Main HTML structure with theme toggle and game board container
- **js/tic-tac-toe.js**: Core game logic using vanilla JavaScript
- **css/tic-tac-toe.css**: Styling with dark/light theme support

## Running the Project

Since this is a static HTML/CSS/JS project:

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

## Architecture

### Game Logic (js/tic-tac-toe.js:18-101)
- **Board Creation**: Dynamic table generation with 3x3 grid
- **Win Detection**: Uses CSS class-based checking (row, column, diagonal classes)
- **Game State**: Tracks turn, score, and moves using global variables
- **Theme Toggle**: Event listener for dark/light mode switching

### Styling (css/tic-tac-toe.css)
- **Responsive Design**: Flexbox layout with centered container
- **Theme System**: Dark/light mode classes with CSS variables
- **Visual Feedback**: Hover states and transition animations
- **3D Elements**: Placeholder paths for X/O image backgrounds

### Key Components
- **init()**: Sets up the game board and event listeners
- **set()**: Handles cell clicks and game state updates  
- **win()**: Checks for winning conditions using CSS class selectors
- **startNewGame()**: Resets game state for new rounds

## File Structure
```
/
├── index.html          # Main HTML file
├── css/
│   └── tic-tac-toe.css # Styles and themes
└── js/
    └── tic-tac-toe.js  # Game logic
```

## Security Requirements

### Authentication & Authorization
- **Password Security**: Use bcrypt for password hashing with minimum 12 rounds
- **Session Management**: Implement secure session tokens with expiration
- **Input Validation**: Sanitize all user inputs on both client and server side
- **SQL Injection Prevention**: Use parameterized queries for all database operations
- **CSRF Protection**: Implement CSRF tokens for state-changing operations

### Database Security
- **Connection Security**: Use environment variables for database credentials
- **Data Encryption**: Encrypt sensitive user data at rest
- **Access Control**: Implement least privilege database user permissions
- **Audit Logging**: Log all authentication attempts and game actions

### API Security
- **Rate Limiting**: Implement rate limiting on login and API endpoints
- **HTTPS Only**: Force HTTPS in production environments
- **Authentication Headers**: Use secure headers (Authorization: Bearer)
- **Data Validation**: Validate all API inputs and outputs

### Client-Side Security
- **XSS Prevention**: Sanitize all user-generated content
- **Secure Storage**: Never store sensitive data in localStorage
- **Content Security Policy**: Implement CSP headers
- **Input Sanitization**: Validate game moves and user inputs

### Security Headers
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

## Development Notes

- No build tools or package managers required
- Uses semantic HTML with ARIA attributes for accessibility
- CSS classes are used for both styling and game logic (win detection)
- Game state is managed through global JavaScript variables
- Theme switching implemented via body class toggling