/**
 * Appointment Model
 * Manages bookings between patients and doctors
 * Full lifecycle: pending → approved → completed/cancelled
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const appointmentSchema = new mongoose.Schema(
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
    patientProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },

    // Scheduling
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    duration: { type: Number, default: 30 }, // minutes

    // Type
    type: {
      type: String,
      enum: ['online', 'in_person'],
      default: 'online',
    },
    meetingLink: { type: String, trim: true },

    // Status Lifecycle
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
      index: true,
    },
    statusHistory: [{
      status: { type: String },
      changedAt: { type: Date, default: Date.now },
      changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: { type: String, trim: true },
    }],

    // Patient's Reason for Visit
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      maxlength: [500, 'Reason cannot exceed 500 characters'],
      trim: true,
    },
    symptoms: [{ type: String, trim: true }],
    priority: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      default: 'routine',
    },

    // Doctor's Response
    rejectionReason: { type: String, trim: true },
    doctorNotes: { type: String, trim: true },

    // Consultation Notes (post-appointment)
    consultation: {
      diagnosis: { type: String, trim: true },
      recommendations: { type: String, trim: true },
      followUpDate: { type: Date },
      documents: [{
        name: { type: String },
        url: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      }],
    },

    // Payment
    fee: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'waived'],
      default: 'pending',
    },
    paymentId: { type: String, trim: true },

    // Reminders
    reminderSent: { type: Boolean, default: false },
    patientRating: { type: Number, min: 1, max: 5 },
    patientFeedback: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
appointmentSchema.index({ patient: 1, status: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, status: 1, appointmentDate: -1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });

// ─── Pre-save: Enforce Doctor Can't Book Own Appointment ──────────────────────
appointmentSchema.pre('save', function (next) {
  if (this.patient.toString() === this.doctor.toString()) {
    return next(new Error('Doctor cannot book appointment with themselves'));
  }
  next();
});

// ─── Plugin ───────────────────────────────────────────────────────────────────
appointmentSchema.plugin(mongoosePaginate);

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
