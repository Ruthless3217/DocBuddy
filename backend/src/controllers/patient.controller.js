/**
 * Patient Controller
 * Manages patient profiles, medical history, vitals, and their dashboard
 */

const Patient = require('../models/Patient.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const Query = require('../models/Query.model');

/**
 * Get Patient Dashboard
 */
exports.getDashboard = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id })
    .populate('user', 'firstName lastName avatar')
    .lean();

  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient profile not found' });
  }

  // Get summary of recent activity
  const recentAppointments = await Appointment.find({ patient: req.user.id })
    .populate('doctor', 'firstName lastName')
    .sort('-appointmentDate')
    .limit(5);

  const recentQueries = await Query.find({ patient: req.user.id })
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      profile: patient,
      appointments: recentAppointments,
      queries: recentQueries,
      stats: {
        totalAppointments: patient.totalAppointments,
        totalQueries: patient.totalQueries,
        totalAiConversations: patient.totalAiConversations,
      }
    }
  });
};

/**
 * Update Patient Profile
 */
exports.updateProfile = async (req, res) => {
  const { address, emergencyContact, bloodGroup, preferences } = req.body;

  const patient = await Patient.findOneAndUpdate(
    { user: req.user.id },
    { address, emergencyContact, bloodGroup, preferences },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: patient });
};

/**
 * Add Vital Measurement
 */
exports.addVitals = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient profile not found' });
  }

  patient.vitals.push(req.body);
  await patient.save();

  res.status(201).json({ success: true, data: patient.vitals[patient.vitals.length - 1] });
};

/**
 * Get Patient Vitals
 */
exports.getVitals = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id }).select('vitals');
  res.status(200).json({ success: true, data: patient.vitals });
};

/**
 * Add Medical History Entry
 */
exports.addMedicalHistory = async (req, res) => {
  const patient = await Patient.findOne({ user: req.user.id });
  patient.medicalHistory.push(req.body);
  await patient.save();

  res.status(201).json({ success: true, data: patient.medicalHistory });
};

/**
 * Update Medical Preferences
 */
exports.updatePreferences = async (req, res) => {
  const { smokingStatus, alcoholUse, preferredSpecialization, preferredLanguage } = req.body;

  const patient = await Patient.findOneAndUpdate(
    { user: req.user.id },
    { smokingStatus, alcoholUse, preferredSpecialization, preferredLanguage },
    { new: true }
  );

  res.status(200).json({ success: true, data: patient });
};
