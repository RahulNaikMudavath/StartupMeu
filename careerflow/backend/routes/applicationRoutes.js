const express = require('express');
const router = express.Router();

const {
  getAllApplications,
  getStats,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

// NOTE: /stats must be registered before /:id to prevent Express
// from treating the literal string "stats" as a dynamic :id parameter.
router.get('/stats', getStats);
router.get('/', getAllApplications);
router.get('/:id', getApplicationById);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
