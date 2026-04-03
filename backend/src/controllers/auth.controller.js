/**
 * Auth Controller
 * Handles user authentication, registration, login, and token management
 */

const User = require('../models/User.model');
const Patient = require('../models/Patient.model');
const Doctor = require('../models/Doctor.model');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Register User (Patient/Doctor)
 */
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { firstName, lastName, email, password, role, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email already in use' });
  }

  // Create base user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'patient',
    phone,
  });

  // Create role-specific profile
  if (user.role === 'patient') {
    await Patient.create({ user: user._id });
  } else if (user.role === 'doctor') {
    const { specialization, yearsOfExperience, registrationNumber, clinicCity } = req.body;
    await Doctor.create({ 
      user: user._id, 
      specialization, 
      yearsOfExperience, 
      registrationNumber,
      'address.city': clinicCity
    });
  }

  sendTokenResponse(user, 201, res);
};

/**
 * Login User
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  // Find user and include password (which is excluded by default in schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (!user.isActive || user.isBanned) {
    return res.status(403).json({ success: false, message: 'Account deactivated or banned' });
  }

  // Update last login
  user.lastLoginAt = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res);
};

/**
 * Logout User
 */
exports.logout = async (req, res) => {
  // Clear refresh token from storage (e.g., set to null or remove from DB if stored)
  if (req.user) {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

/**
 * Refresh Token
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

/**
 * Helper to send token response
 */
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove password from response
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user,
  });
};
