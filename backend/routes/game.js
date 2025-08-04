const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db/database');
const auth = require('../middleware/auth');

const router = express.Router();

const validateGameMove = [
  body('position').isInt({ min: 0, max: 8 }).withMessage('Position must be 0-8'),
  body('player').isIn(['X', 'O']).withMessage('Player must be X or O')
];

router.post('/save', auth, validateGameMove, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { board, winner, moves } = req.body;
    const userId = req.user.userId;

    const result = await db.query(
      'INSERT INTO games (user_id, board_state, winner, moves, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [userId, JSON.stringify(board), winner, moves]
    );

    res.status(201).json({
      message: 'Game saved successfully',
      gameId: result.rows[0].id
    });

  } catch (error) {
    console.error('Game save error:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await db.query(
      'SELECT id, board_state, winner, moves, created_at FROM games WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );

    const countResult = await db.query(
      'SELECT COUNT(*) FROM games WHERE user_id = $1',
      [userId]
    );

    res.json({
      games: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    });

  } catch (error) {
    console.error('Game history error:', error);
    res.status(500).json({ error: 'Failed to retrieve game history' });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await db.query(`
      SELECT 
        COUNT(*) as total_games,
        COUNT(CASE WHEN winner = 'X' THEN 1 END) as x_wins,
        COUNT(CASE WHEN winner = 'O' THEN 1 END) as o_wins,
        COUNT(CASE WHEN winner = 'Draw' THEN 1 END) as draws,
        AVG(moves) as avg_moves
      FROM games 
      WHERE user_id = $1
    `, [userId]);

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Game stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve game statistics' });
  }
});

module.exports = router;