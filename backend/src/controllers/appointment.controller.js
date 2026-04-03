/**
 * Appointment Controller
 * Managing patient-doctor scheduling, booking, and status updates
 */

const Appointment = require('../models/Appointment.model');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');
const logger = require('../config/logger');

/**
 * Book Appointment (Patient)
 */
exports.bookAppointment = async (req, res) => {
  const { doctorId, appointmentDate, startTime, type, reason, symptoms, priority } = req.body;

  // Verify doctor exists
  const doctor = await Doctor.findOne({ user: doctorId });
  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor not found' });
  }

  // Get patient profile
  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) {
    return res.status(404).json({ success: false, message: 'Patient profile not found' });
  }

  // Check if slot is available (Simple version: one appt per time slot per doctor)
  const existingAppt = await Appointment.findOne({
    doctor: doctorId,
    appointmentDate: new Date(appointmentDate).setHours(0, 0, 0, 0),
    startTime,
    status: { $in: ['pending', 'approved'] }
  });

  if (existingAppt) {
    return res.status(400).json({ success: false, message: 'This time slot is already booked or pending approval' });
  }

  // Create Appointment
  const appointment = await Appointment.create({
    patient: req.user.id,
    doctor: doctorId,
    doctorProfile: doctor._id,
    patientProfile: patient._id,
    appointmentDate,
    startTime,
    type: type || 'online',
    reason,
    symptoms: symptoms || [],
    priority: priority || 'routine',
    fee: type === 'online' ? doctor.consultationFee.online : doctor.consultationFee.inPerson,
  });

  // Update counters
  patient.totalAppointments += 1;
  await patient.save();

  doctor.totalAppointments += 1;
  await doctor.save();

  res.status(201).json({ success: true, data: appointment });
};

/**
 * Handle Appointment (Doctor) - Accept/Reject
 */
exports.updateStatus = async (req, res) => {
  const { status, reason } = req.body;
  const appointmentId = req.params.id;

  const validStatuses = ['approved', 'rejected', 'completed', 'cancelled', 'no_show'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }

  // Permission: Doctor of the appt or Admin
  if (appointment.doctor.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  // Update status history
  appointment.statusHistory.push({
    status: status,
    changedBy: req.user.id,
    reason: reason || 'Status updated by doctor',
  });

  appointment.status = status;
  if (status === 'rejected') appointment.rejectionReason = reason;
  
  await appointment.save();

  res.status(200).json({ success: true, data: appointment });
};

/**
 * Get My Appointments
 */
exports.getMyAppointments = async (req, res) => {
  const { status, page, limit } = req.query;
  
  const queryFilter = {};
  if (req.user.role === 'patient') queryFilter.patient = req.user.id;
  if (req.user.role === 'doctor') queryFilter.doctor = req.user.id;
  if (status) queryFilter.status = status;

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: '-appointmentDate -startTime',
    populate: [
      { path: 'doctor', select: 'firstName lastName avatar' },
      { path: 'patient', select: 'firstName lastName avatar' },
      { path: 'doctorProfile', select: 'specialization clinicName' }
    ]
  };

  const results = await Appointment.paginate(queryFilter, options);

  res.status(200).json({
    success: true,
    data: results.docs,
    total: results.totalDocs,
    pages: results.totalPages,
    currentPage: results.page,
  });
};

/**
 * Upload Consultation Notes (Doctor Post-Appointment)
 */
exports.completeAppointment = async (req, res) => {
  const { diagnosis, recommendations, followUpDate } = req.body;
  const appointmentId = req.params.id;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment || appointment.doctor.toString() !== req.user.id) {
    return res.status(404).json({ success: false, message: 'Appointment not found or unauthorized' });
  }

  appointment.status = 'completed';
  appointment.consultation = {
    diagnosis,
    recommendations,
    followUpDate,
  };

  await appointment.save();

  res.status(200).json({ success: true, data: appointment });
};
