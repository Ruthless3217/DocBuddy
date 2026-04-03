/**
 * Appointment Routes
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/book', protect, authorize('patient'), appointmentController.bookAppointment);
router.get('/my', protect, appointmentController.getMyAppointments);
router.patch('/:id/status', protect, appointmentController.updateStatus);
router.patch('/:id/complete', protect, authorize('doctor'), appointmentController.completeAppointment);

module.exports = router;
