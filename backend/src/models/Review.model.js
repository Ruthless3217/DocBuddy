/**
 * Review Model
 * Patient reviews and ratings for doctors
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    doctorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },

    // Ratings (1–5 stars)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    // Detailed sub-ratings
    subRatings: {
      communication: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
      punctuality: { type: Number, min: 1, max: 5 },
      helpfulness: { type: Number, min: 1, max: 5 },
    },

    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },

    // Moderation
    isVisible: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false }, // verified purchase/appointment
    isFlagged: { type: Boolean, default: false },
    flagReason: { type: String, trim: true },

    // Doctor's response to review
    doctorResponse: {
      content: { type: String, trim: true },
      respondedAt: { type: Date },
    },

    // Upvotes by others
    helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    helpfulCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// ─── Unique: One review per patient per doctor ────────────────────────────────
reviewSchema.index({ patient: 1, doctor: 1 }, { unique: true });
reviewSchema.index({ doctor: 1, rating: -1 });

// ─── Post-save: Update Doctor Average Rating ──────────────────────────────────
reviewSchema.post('save', async function () {
  const Doctor = mongoose.model('Doctor');
  const stats = await mongoose.model('Review').aggregate([
    { $match: { doctor: this.doctor, isVisible: true } },
    {
      $group: {
        _id: '$doctor',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);
  if (stats.length > 0) {
    await Doctor.findOneAndUpdate(
      { user: this.doctor },
      {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      }
    );
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
