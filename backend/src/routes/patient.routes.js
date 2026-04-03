/**
 * Patient Routes
 */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/dashboard', protect, authorize('patient'), patientController.getDashboard);
router.put('/profile', protect, authorize('patient'), patientController.updateProfile);
router.post('/vitals', protect, authorize('patient'), patientController.addVitals);
router.get('/vitals', protect, authorize('patient'), patientController.getVitals);

module.exports = router;
