/**
 * Doctor Routes
 */

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', doctorController.getDoctorsList);
router.get('/:id', doctorController.getDoctorProfile);
router.get('/dashboard/me', protect, authorize('doctor'), doctorController.getDashboard);
router.put('/profile/me', protect, authorize('doctor'), doctorController.updateOwnProfile);

module.exports = router;
