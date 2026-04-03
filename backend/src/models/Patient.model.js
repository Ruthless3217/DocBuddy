/**
 * Patient Model
 * Extended profile for users with role='patient'
 * Linked to User model via reference
 */

const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
  condition: { type: String, required: true, trim: true },
  diagnosedAt: { type: Date },
  medications: [{ type: String, trim: true }],
  notes: { type: String, trim: true },
  isCurrent: { type: Boolean, default: true },
}, { _id: false });

const allergySchema = new mongoose.Schema({
  allergen: { type: String, required: true, trim: true },
  severity: {
    type: String,
    enum: ['mild', 'moderate', 'severe'],
    default: 'mild',
  },
  reaction: { type: String, trim: true },
}, { _id: false });

const vitalSchema = new mongoose.Schema({
  recordedAt: { type: Date, default: Date.now },
  bloodPressure: {
    systolic: { type: Number, min: 60, max: 250 },
    diastolic: { type: Number, min: 40, max: 150 },
  },
  heartRate: { type: Number, min: 30, max: 250 },
  temperature: { type: Number, min: 35, max: 42 },
  weight: { type: Number, min: 1, max: 500 },      // kg
  height: { type: Number, min: 30, max: 300 },     // cm
  bloodGlucose: { type: Number, min: 20, max: 800 }, // mg/dL
  oxygenSaturation: { type: Number, min: 70, max: 100 }, // percentage
  notes: { type: String, trim: true },
});

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
      default: 'unknown',
    },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      pincode: { type: String, trim: true },
    },
    emergencyContact: {
      name: { type: String, trim: true },
      relationship: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    // Medical history tracking
    medicalHistory: [medicalHistorySchema],
    allergies: [allergySchema],
    currentMedications: [{
      name: { type: String, trim: true },
      dosage: { type: String, trim: true },
      frequency: { type: String, trim: true },
      prescribedBy: { type: String, trim: true },
      startDate: { type: Date },
    }],
    vitals: [vitalSchema],

    // Insurance
    insurance: {
      provider: { type: String, trim: true },
      policyNumber: { type: String, trim: true },
      validUntil: { type: Date },
    },

    // Preferences for healthcare
    preferredSpecialization: [{ type: String, trim: true }],
    preferredLanguage: { type: String, default: 'English', trim: true },
    smokingStatus: {
      type: String,
      enum: ['never', 'former', 'current', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },
    alcoholUse: {
      type: String,
      enum: ['none', 'occasional', 'moderate', 'heavy', 'prefer_not_to_say'],
      default: 'prefer_not_to_say',
    },

    // AI conversation history reference count
    totalAiConversations: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    totalQueries: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: BMI ─────────────────────────────────────────────────────────────
patientSchema.virtual('bmi').get(function () {
  const latest = this.vitals && this.vitals[this.vitals.length - 1];
  if (!latest || !latest.weight || !latest.height) return null;
  const heightInMeters = latest.height / 100;
  return (latest.weight / (heightInMeters * heightInMeters)).toFixed(1);
});

const Patient = mongoose.model('Patient', patientSchema);
module.exports = Patient;
