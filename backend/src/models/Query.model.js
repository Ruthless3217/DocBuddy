/**
 * Query Model
 * Medical questions posted by patients
 * Supports categorized, threaded discussions
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MEDICAL_CATEGORIES = [
  'General Medicine',
  'Cardiology',
  'Diabetes & Endocrinology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Gynecology',
  'Pediatrics',
  'Psychiatry & Mental Health',
  'Oncology',
  'Ophthalmology',
  'ENT',
  'Urology',
  'Nephrology',
  'Gastroenterology',
  'Pulmonology',
  'Rheumatology',
  'Infectious Disease',
  'Nutrition & Diet',
  'Emergency Medicine',
  'Other',
];

const querySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },

    // Query Content
    title: {
      type: String,
      required: [true, 'Query title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Query description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: MEDICAL_CATEGORIES,
        message: '{VALUE} is not a valid medical category',
      },
      index: true,
    },
    tags: [{ type: String, lowercase: true, trim: true }],

    // Severity / Context
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'unknown'],
      default: 'unknown',
    },
    duration: {
      type: String,
      trim: true,
      // e.g., "3 days", "2 weeks", "1 month"
    },
    attachments: [{
      name: { type: String },
      url: { type: String },
      type: { type: String, enum: ['image', 'document', 'report'] },
      uploadedAt: { type: Date, default: Date.now },
    }],

    // Status
    status: {
      type: String,
      enum: ['open', 'answered', 'closed', 'flagged'],
      default: 'open',
      index: true,
    },

    // Visibility
    isAnonymous: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },

    // Engagement
    views: { type: Number, default: 0 },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    upvoteCount: { type: Number, default: 0 },

    // Answer tracking
    totalAnswers: { type: Number, default: 0 },
    hasAiAnswer: { type: Boolean, default: false },
    hasDoctorAnswer: { type: Boolean, default: false },
    bestAnswer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Answer',
      default: null,
    },

    // Flags
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Text Search Index ────────────────────────────────────────────────────────
querySchema.index({ title: 'text', description: 'text', tags: 'text' });
querySchema.index({ category: 1, status: 1, createdAt: -1 });
querySchema.index({ patient: 1, status: 1 });

// ─── Pre-save: Sync upvote count ─────────────────────────────────────────────
querySchema.pre('save', function (next) {
  if (this.isModified('upvotes')) {
    this.upvoteCount = this.upvotes.length;
  }
  next();
});

querySchema.plugin(mongoosePaginate);

// Export categories for use in validators
querySchema.statics.CATEGORIES = MEDICAL_CATEGORIES;

const Query = mongoose.model('Query', querySchema);
module.exports = Query;
