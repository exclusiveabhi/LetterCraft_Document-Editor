const express = require('express');
const router = express.Router();
const { saveLetterToDrive } = require('../controllers/driveController');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.status(401).send({ error: 'Unauthorized' });
}

// Endpoint to save a letter to Google Drive
router.post('/save', ensureAuthenticated, saveLetterToDrive);

module.exports = router;
