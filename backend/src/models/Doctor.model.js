/**
 * Doctor Model
 * Extended profile for users with role='doctor'
 * Includes specializations, availability, and credentials
 */

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  startTime: { type: String, required: true }, // "09:00"
  endTime: { type: String, required: true },   // "18:00"
  isAvailable: { type: Boolean, default: true },
  slotDuration: { type: Number, default: 30 }, // minutes per slot
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  year: { type: Number },
  specialization: { type: String, trim: true },
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  hospital: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number }, // null means current
  isCurrent: { type: Boolean, default: false },
}, { _id: false });

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },

    // Professional Info
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      index: true,
    },
    subSpecializations: [{ type: String, trim: true }],
    registrationNumber: {
      type: String,
      required: [true, 'Medical registration number is required'],
      unique: true,
      trim: true,
    },
    registrationCouncil: {
      type: String,
      trim: true,
      default: 'Medical Council of India',
    },
    yearsOfExperience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      index: true,
    },

    // Education & Experience
    education: [educationSchema],
    experience: [experienceSchema],

    // Languages
    languagesSpoken: [{
      type: String,
      trim: true,
    }],

    // Location
    clinicName: { type: String, trim: true },
    address: {
      street: { type: String, trim: true },
      city: {
        type: String,
        trim: true,
        required: [true, 'City is required'],
        index: true,
      },
      state: { type: String, trim: true },
      country: { type: String, trim: true, default: 'India' },
      pincode: { type: String, trim: true },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },

    // Consultation Details
    consultationFee: {
      online: { type: Number, min: 0, default: 300 },
      inPerson: { type: Number, min: 0, default: 500 },
    },
    consultationDuration: { type: Number, default: 30 }, // minutes

    // Availability
    availability: [availabilitySlotSchema],
    isAvailableForOnline: { type: Boolean, default: true },
    isAvailableForInPerson: { type: Boolean, default: true },

    // Rating & Reviews
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
      index: true,
    },
    totalReviews: { type: Number, default: 0 },
    totalAppointments: { type: Number, default: 0 },
    totalPatients: { type: Number, default: 0 },
    totalQueryAnswers: { type: Number, default: 0 },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    verifiedAt: { type: Date },
    verificationDocuments: [{
      type: { type: String },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    }],

    // Bio
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      trim: true,
    },
    profileCompleteness: { type: Number, min: 0, max: 100, default: 0 },

    // Tags for search
    tags: [{ type: String, lowercase: true, trim: true }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Geospatial Index ─────────────────────────────────────────────────────────
doctorSchema.index({ 'address.coordinates': '2dsphere' });
doctorSchema.index({ specialization: 1, averageRating: -1, 'address.city': 1 });
doctorSchema.index({ isVerified: 1, isAvailableForOnline: 1 });

// ─── Plugin: Pagination ───────────────────────────────────────────────────────
doctorSchema.plugin(mongoosePaginate);

// ─── Pre-save: Calculate Profile Completeness ─────────────────────────────────
doctorSchema.pre('save', function (next) {
  const fields = [
    this.bio, this.clinicName, this.address?.city,
    this.education?.length, this.experience?.length,
    this.availability?.length, this.languagesSpoken?.length,
  ];
  const filled = fields.filter(Boolean).length;
  this.profileCompleteness = Math.round((filled / fields.length) * 100);
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
