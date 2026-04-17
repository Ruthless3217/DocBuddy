/**
 * Admin Routes
 * All routes protected by JWT + admin role
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get('/dashboard', adminController.getDashboardStats);

// ─── User Management ──────────────────────────────────────────────────────────
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/ban', adminController.toggleUserBan);

// ─── Doctor Verification ──────────────────────────────────────────────────────
router.get('/doctors/pending', adminController.getPendingDoctors);
router.patch('/doctors/:id/verify', adminController.verifyDoctor);

// ─── Activity Log ─────────────────────────────────────────────────────────────
router.get('/activity', adminController.getActivityLog);

module.exports = router;
