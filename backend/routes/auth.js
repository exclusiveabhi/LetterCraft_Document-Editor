const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start Google OAuth process with required scopes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'] 
}));

// Handle callback after Google authentication
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/failure' }), 
  (req, res) => {
    // Successful authentication, redirect to the frontend dashboard.
    res.redirect('https://document-editor-sooty.vercel.app/dashboard');
});

// Failure route
router.get('/failure', (req, res) => {
  res.send('Failed to authenticate.');
});

// Logout route
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('https://document-editor-sooty.vercel.app/');
  });
});


// Get current user info (used by frontend to display user details)
router.get('/current_user', (req, res) => {
  res.send(req.user);
  console.log(`user form auth file ${req.user}`);
});

module.exports = router;
