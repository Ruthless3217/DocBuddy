/**
 * Doctor Controller
 * Handles doctor discovery, profile management, and dashboard for doctors
 */

const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');
const Appointment = require('../models/Appointment.model');
const Review = require('../models/Review.model');

/**
 * List Doctors (Discovery)
 */
exports.getDoctorsList = async (req, res) => {
  const { city, specialization, rating, sort, page, limit } = req.query;

  const query = { isVerified: true }; // Only show verified doctors

  if (city) query['address.city'] = { $regex: city, $options: 'i' };
  if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
  if (rating) query.averageRating = { $gte: parseFloat(rating) };

  // Advanced Sorting
  let sortOption = { averageRating: -1, totalReviews: -1 }; // Default Sort: Best Rated
  if (sort === 'experience') sortOption = { yearsOfExperience: -1 };
  if (sort === 'fee_low') sortOption = { 'consultationFee.online': 1 };
  if (sort === 'fee_high') sortOption = { 'consultationFee.online': -1 };

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: sortOption,
    populate: { path: 'user', select: 'firstName lastName avatar email phone' },
  };

  const results = await Doctor.paginate(query, options);

  res.status(200).json({
    success: true,
    data: results.docs,
    total: results.totalDocs,
    pages: results.totalPages,
    currentPage: results.page,
  });
};

/**
 * Get Doctor Profile (Public)
 */
exports.getDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findOne({ _id: req.params.id })
    .populate('user', 'firstName lastName avatar phone email')
    .lean();

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  // Get doctors' reviews
  const reviews = await Review.find({ doctor: doctor.user._id })
    .populate('patient', 'firstName lastName avatar')
    .sort('-createdAt')
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      profile: doctor,
      reviews,
    }
  });
};

/**
 * Update Doctor Profile (Private)
 */
exports.updateOwnProfile = async (req, res) => {
  const { 
    specialization, clinicCity, consultationFee, 
    availability, education, experience, bio 
  } = req.body;

  const doctor = await Doctor.findOneAndUpdate(
    { user: req.user.id },
    { 
      specialization, 'address.city': clinicCity, 
      consultationFee, availability, education, 
      experience, bio 
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({ success: true, data: doctor });
};

/**
 * Get Doctor Dashboard
 */
exports.getDashboard = async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.user.id })
    .populate('user', 'firstName lastName avatar')
    .lean();

  if (!doctor) {
    return res.status(404).json({ success: false, message: 'Doctor profile not found' });
  }

  // Activity Overview
  const stats = {
    pendingAppointments: await Appointment.countDocuments({ doctor: req.user.id, status: 'pending' }),
    approvedAppointments: await Appointment.countDocuments({ doctor: req.user.id, status: 'approved' }),
    totalPatients: doctor.totalPatients,
    averageRating: doctor.averageRating,
  };

  const upcomingAppointments = await Appointment.find({
    doctor: req.user.id,
    status: 'approved',
    appointmentDate: { $gte: new Date() }
  })
    .populate('patient', 'firstName lastName avatar email')
    .sort('appointmentDate startTime')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      profile: doctor,
      stats,
      upcomingAppointments,
    }
  });
};
