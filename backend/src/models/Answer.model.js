/**
 * Answer Model
 * Responses to medical queries from doctors or AI
 * Supports threaded replies and upvoting
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const answerSchema = new mongoose.Schema(
  {
    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Query',
      required: true,
      index: true,
    },

    // Author (null for AI answers)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    authorType: {
      type: String,
      enum: ['doctor', 'ai', 'admin'],
      required: true,
    },

    // Content
    content: {
      type: String,
      required: [true, 'Answer content is required'],
      trim: true,
      maxlength: [5000, 'Answer cannot exceed 5000 characters'],
    },

    // AI-specific structured response
    aiResponse: {
      // Structured JSON from LLM
      summary: { type: String },
      possibleCauses: [{ type: String }],
      recommendations: [{ type: String }],
      warningFlags: [{ type: String }],
      shouldSeeDoctor: { type: Boolean },
      urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
      },
      disclaimer: {
        type: String,
        default: 'This information is for educational purposes only and does not constitute medical advice. Please consult a qualified healthcare professional for proper diagnosis and treatment.',
      },
      modelUsed: { type: String },
      tokensUsed: { type: Number },
      confidence: { type: Number, min: 0, max: 1 },
    },

    // Threaded replies
    parentAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null,
    },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    replyCount: { type: Number, default: 0 },

    // Engagement
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false },

    // Moderation
    isVisible: { type: Boolean, default: true },
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, trim: true },

    // Attachments
    attachments: [{
      name: { type: String },
      url: { type: String },
    }],

    // Edit history
    editHistory: [{
      content: { type: String },
      editedAt: { type: Date, default: Date.now },
    }],
    lastEditedAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
answerSchema.index({ query: 1, authorType: 1, createdAt: -1 });
answerSchema.index({ author: 1, authorType: 1 });
answerSchema.index({ parentAnswer: 1 });

// ─── Pre-save ─────────────────────────────────────────────────────────────────
answerSchema.pre('save', function (next) {
  if (this.isModified('upvotes')) {
    this.upvoteCount = this.upvotes.length;
  }
  next();
});

answerSchema.plugin(mongoosePaginate);

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
