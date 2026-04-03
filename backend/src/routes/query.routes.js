/**
 * Query Routes
 */

const express = require('express');
const router = express.Router();
const queryController = require('../controllers/query.controller');
const { protect, authorize, optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, queryController.getQueries); // Public browse
router.get('/:id', optionalAuth, queryController.getQueryById);
router.post('/', protect, authorize('patient'), queryController.postQuery);
router.post('/:id/answer', protect, authorize('doctor', 'admin'), queryController.postAnswer);
router.post('/:id/upvote', protect, queryController.upvoteQuery);

module.exports = router;
