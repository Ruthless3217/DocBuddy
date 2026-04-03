/**
 * Query Controller
 * Handles medical query creation, response management, and category browsing
 */

const Query = require('../models/Query.model');
const Answer = require('../models/Answer.model');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');
const User = require('../models/User.model');
const winston = require('../config/logger');

/**
 * Post Medical Query (Patient)
 */
exports.postQuery = async (req, res) => {
  const { title, description, category, tags, severity, duration } = req.body;

  const patient = await Patient.findOne({ user: req.user.id });
  if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });

  const query = await Query.create({
    patient: req.user.id,
    patientProfile: patient._id,
    title,
    description,
    category,
    tags: tags || [],
    severity: severity || 'unknown',
    duration: duration || '',
  });

  // Increment query counter
  patient.totalQueries += 1;
  await patient.save();

  res.status(201).json({ success: true, data: query });
};

/**
 * List Queries (Browsing)
 */
exports.getQueries = async (req, res) => {
  const { category, status, search, page, limit } = req.query;

  const queryFilter = { isPublic: true }; // Only show public queries
  
  if (category) queryFilter.category = category;
  if (status) queryFilter.status = status;
  if (search) queryFilter.$text = { $search: search };

  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: '-createdAt',
    populate: { path: 'patient', select: 'firstName lastName avatar' },
  };

  const results = await Query.paginate(queryFilter, options);

  res.status(200).json({
    success: true,
    data: results.docs,
    total: results.totalDocs,
    pages: results.totalPages,
    currentPage: results.page,
  });
};

/**
 * Get Specific Query & Answers
 */
exports.getQueryById = async (req, res) => {
  const query = await Query.findById(req.params.id)
    .populate('patient', 'firstName lastName avatar')
    .lean();

  if (!query) return res.status(404).json({ success: false, message: 'Query not found' });

  // Increment view count
  await Query.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

  // Get Answers
  const answers = await Answer.find({ query: req.params.id, isVisible: true })
    .populate('author', 'firstName lastName avatar role')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    data: {
      query,
      answers,
    }
  });
};

/**
 * Respond to Query (Doctor)
 */
exports.postAnswer = async (req, res) => {
  const { content } = req.body;
  const queryId = req.params.id;

  const query = await Query.findById(queryId);
  if (!query) return res.status(404).json({ success: false, message: 'Query not found' });

  const answer = await Answer.create({
    query: queryId,
    author: req.user.id,
    authorType: req.user.role,
    content,
  });

  // Update query flags
  query.status = 'answered';
  if (req.user.role === 'doctor') {
    query.hasDoctorAnswer = true;
    
    // Update Doctor Stats
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (doctor) {
      doctor.totalQueryAnswers += 1;
      await doctor.save();
    }
  }
  
  query.totalAnswers += 1;
  await query.save();

  res.status(201).json({ success: true, data: answer });
};

/**
 * Vote Up Query (Patient/Doctor/User)
 */
exports.upvoteQuery = async (req, res) => {
  const query = await Query.findById(req.params.id);
  if (!query) return res.status(404).json({ success: false, message: 'Query not found' });

  // Check if already upvoted
  const upvoted = query.upvotes.includes(req.user.id);
  if (upvoted) {
    query.upvotes = query.upvotes.filter(id => id.toString() !== req.user.id.toString());
  } else {
    query.upvotes.push(req.user.id);
  }

  await query.save();
  res.status(200).json({ success: true, count: query.upvoteCount });
};
