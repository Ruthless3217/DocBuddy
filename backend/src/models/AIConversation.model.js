/**
 * AI Conversation Model
 * Stores chat sessions between patients and the AI Health Assistant
 * Context-aware: maintains message history per session
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // Structured AI response payload
  structuredResponse: {
    summary: { type: String },
    possibleCauses: [{ type: String }],
    recommendations: [{ type: String }],
    warningFlags: [{ type: String }],
    shouldSeeDoctor: { type: Boolean },
    urgencyLevel: { type: String },
    suggestedSpecialization: { type: String },
    disclaimer: { type: String },
  },
  // Token usage
  tokensUsed: { type: Number, default: 0 },
  latencyMs: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const aiConversationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      default: 'New Health Conversation',
    },
    messages: [messageSchema],
    messageCount: { type: Number, default: 0 },

    // Context tracking
    detectedSymptoms: [{ type: String }],
    detectedConditions: [{ type: String }],
    suggestedSpecializations: [{ type: String }],

    // Flags
    wasEscalated: { type: Boolean, default: false },
    escalationReason: { type: String, trim: true },
    wasReviewedByDoctor: { type: Boolean, default: false },

    // Stats
    totalTokensUsed: { type: Number, default: 0 },
    model: { type: String, default: 'gemini-pro' },
    isActive: { type: Boolean, default: true },
    lastMessageAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
aiConversationSchema.index({ patient: 1, lastMessageAt: -1 });
aiConversationSchema.index({ sessionId: 1 });

const AIConversation = mongoose.model('AIConversation', aiConversationSchema);
module.exports = AIConversation;
