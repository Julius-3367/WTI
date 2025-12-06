const express = require('express');
const router = express.Router();
const cohortController = require('../controllers/cohortController');
const { authenticate, authorize } = require('../middleware/auth');

// All cohort routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/cohorts
 * @desc    Get all cohorts with filters
 * @access  Admin, Trainer
 */
router.get('/', authorize(['Admin', 'Trainer']), cohortController.getCohorts);

/**
 * @route   POST /api/cohorts
 * @desc    Create a new cohort
 * @access  Admin
 */
router.post('/', authorize(['Admin']), cohortController.createCohort);

/**
 * @route   GET /api/cohorts/:id
 * @desc    Get cohort by ID with full details
 * @access  Admin, Trainer
 */
router.get('/:id', authorize(['Admin', 'Trainer']), cohortController.getCohortById);

/**
 * @route   PUT /api/cohorts/:id
 * @desc    Update cohort
 * @access  Admin
 */
router.put('/:id', authorize(['Admin']), cohortController.updateCohort);

/**
 * @route   DELETE /api/cohorts/:id
 * @desc    Delete cohort
 * @access  Admin
 */
router.delete('/:id', authorize(['Admin']), cohortController.deleteCohort);

/**
 * @route   GET /api/cohorts/:id/progress
 * @desc    Get cohort progress/dashboard
 * @access  Admin, Trainer
 */
router.get('/:id/progress', authorize(['Admin', 'Trainer']), cohortController.getCohortProgress);

/**
 * @route   POST /api/cohorts/:id/publish
 * @desc    Publish cohort
 * @access  Admin
 */
router.post('/:id/publish', authorize(['Admin']), cohortController.publishCohort);

/**
 * @route   POST /api/cohorts/:id/enrollment/open
 * @desc    Open enrollment for cohort
 * @access  Admin
 */
router.post('/:id/enrollment/open', authorize(['Admin']), cohortController.openEnrollment);

/**
 * @route   POST /api/cohorts/:id/enrollment/close
 * @desc    Close enrollment for cohort
 * @access  Admin
 */
router.post('/:id/enrollment/close', authorize(['Admin']), cohortController.closeEnrollment);

/**
 * @route   POST /api/cohorts/:id/enroll
 * @desc    Enroll student in cohort
 * @access  Admin
 */
router.post('/:id/enroll', authorize(['Admin']), cohortController.enrollStudent);

/**
 * @route   PUT /api/cohorts/:id/enrollments/:enrollmentId
 * @desc    Update cohort enrollment status
 * @access  Admin
 */
router.put('/:id/enrollments/:enrollmentId', authorize(['Admin']), cohortController.updateEnrollmentStatus);

/**
 * @route   POST /api/cohorts/:id/sessions
 * @desc    Create cohort session
 * @access  Admin, Trainer
 */
router.post('/:id/sessions', authorize(['Admin', 'Trainer']), cohortController.createSession);

/**
 * @route   PUT /api/cohorts/:id/sessions/:sessionId
 * @desc    Update cohort session
 * @access  Admin, Trainer
 */
router.put('/:id/sessions/:sessionId', authorize(['Admin', 'Trainer']), cohortController.updateSession);

/**
 * @route   POST /api/cohorts/:id/summary
 * @desc    Generate progress summary
 * @access  Admin
 */
router.post('/:id/summary', authorize(['Admin']), cohortController.generateProgressSummary);

/**
 * @route   POST /api/cohorts/:id/metrics/update
 * @desc    Update cohort metrics
 * @access  Admin
 */
router.post('/:id/metrics/update', authorize(['Admin']), cohortController.updateMetrics);

/**
 * @route   POST /api/cohorts/:id/archive
 * @desc    Archive cohort
 * @access  Admin
 */
router.post('/:id/archive', authorize(['Admin']), cohortController.archiveCohort);

module.exports = router;
