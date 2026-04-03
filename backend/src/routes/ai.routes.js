/**
 * AI Routes
 */

const express = require('express');
const router = express.Router();
const aiService = require('../services/ai.service');
const { protect, authorize } = require('../middleware/auth.middleware');
const AIConversation = require('../models/AIConversation.model');

router.post('/chat', protect, authorize('patient'), async (req, res) => {
  const { sessionId, message } = req.body;
  if (!message) return res.status(400).json({ success: false, message: 'Message content is required' });

  const aiResponse = await aiService.chatWithAi(req.user.id, sessionId, message);
  res.status(200).json({ success: true, response: aiResponse });
});

router.get('/history', protect, authorize('patient'), async (req, res) => {
  const history = await AIConversation.find({ patient: req.user.id }).sort('-lastMessageAt');
  res.status(200).json({ success: true, history });
});

router.get('/session/:sessionId', protect, authorize('patient'), async (req, res) => {
  const session = await AIConversation.findOne({ 
    sessionId: req.params.sessionId, 
    patient: req.user.id 
  });
  if (!session) return res.status(404).json({ success: false, message: 'Session not found' });
  res.status(200).json({ success: true, session });
});

module.exports = router;
