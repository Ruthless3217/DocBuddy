/**
 * Admin Controller
 * Platform-wide management: users, doctor verification, analytics
 */

const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Patient = require('../models/Patient.model');
const Appointment = require('../models/Appointment.model');
const Query = require('../models/Query.model');

/**
 * GET /api/admin/dashboard
 * Returns platform-wide analytics and summary
 */
exports.getDashboardStats = async (req, res) => {
  const [
    totalPatients,
    totalDoctors,
    totalDoctorsVerified,
    pendingVerifications,
    totalAppointments,
    todayAppointments,
    totalQueries,
    newUsersThisWeek,
  ] = await Promise.all([
    User.countDocuments({ role: 'patient', isActive: true }),
    User.countDocuments({ role: 'doctor', isActive: true }),
    Doctor.countDocuments({ isVerified: true }),
    Doctor.countDocuments({ isVerified: false }),
    Appointment.countDocuments(),
    Appointment.countDocuments({
      appointmentDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    }),
    Query.countDocuments(),
    User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: { totalPatients, totalDoctors, totalDoctorsVerified, pendingVerifications, newUsersThisWeek },
      platform: { totalAppointments, todayAppointments, totalQueries },
    },
  });
};

/**
 * GET /api/admin/users
 * Paginated list of all platform users (patients + doctors)
 */
exports.getAllUsers = async (req, res) => {
  const { role, status, page = 1, limit = 20, search } = req.query;

  const query = {};
  if (role) query.role = role;
  if (status === 'active') query.isActive = true;
  if (status === 'banned') query.isBanned = true;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password -refreshToken')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: users,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
  });
};

/**
 * PATCH /api/admin/users/:id/ban
 * Ban or unban a user
 */
exports.toggleUserBan = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot ban another admin' });

  user.isBanned = !user.isBanned;
  user.isActive = !user.isBanned;
  await user.save();

  res.status(200).json({
    success: true,
    data: { userId: user._id, isBanned: user.isBanned },
    message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully`,
  });
};

/**
 * GET /api/admin/doctors/pending
 * List all doctors awaiting verification
 */
exports.getPendingDoctors = async (req, res) => {
  const doctors = await Doctor.find({ isVerified: false })
    .populate('user', 'firstName lastName email phone avatar createdAt')
    .sort('-createdAt');

  res.status(200).json({ success: true, data: doctors, count: doctors.length });
};

/**
 * PATCH /api/admin/doctors/:id/verify
 * Approve or reject a doctor's verification
 */
exports.verifyDoctor = async (req, res) => {
  const { action } = req.body; // 'approve' | 'reject'
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Action must be approve or reject' });
  }

  const doctor = await Doctor.findById(req.params.id).populate('user');
  if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

  if (action === 'approve') {
    doctor.isVerified = true;
    doctor.verifiedAt = new Date();
    doctor.user.isActive = true;
    await doctor.user.save();
  } else {
    doctor.isVerified = false;
    // Optionally soft-delete or flag the account
  }

  await doctor.save();

  res.status(200).json({
    success: true,
    data: { doctorId: doctor._id, action },
    message: `Doctor ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
  });
};

/**
 * GET /api/admin/activity
 * Recent platform-wide activity log (simplified)
 */
exports.getActivityLog = async (req, res) => {
  const { limit = 20 } = req.query;

  const [recentUsers, recentAppointments, recentQueries] = await Promise.all([
    User.find().select('firstName lastName role createdAt').sort('-createdAt').limit(5),
    Appointment.find()
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName')
      .sort('-createdAt')
      .limit(5),
    Query.find().select('title createdAt').sort('-createdAt').limit(5),
  ]);

  const log = [
    ...recentUsers.map(u => ({
      type: 'user',
      message: `New ${u.role} registered: ${u.firstName} ${u.lastName}`,
      timestamp: u.createdAt,
    })),
    ...recentAppointments.map(a => ({
      type: 'appointment',
      message: `Appointment: ${a.patient?.firstName} with Dr. ${a.doctor?.firstName}`,
      timestamp: a.createdAt,
    })),
    ...recentQueries.map(q => ({
      type: 'query',
      message: `Query posted: ${q.title}`,
      timestamp: q.createdAt,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, parseInt(limit));

  res.status(200).json({ success: true, data: log });
};
