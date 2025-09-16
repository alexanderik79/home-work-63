function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log(`[PROTECTED] Access granted to ${req.user.email}`);
    return next();
  }
  console.log('[PROTECTED] Access denied — not authenticated');
  res.status(401).send('Unauthorized. Please log in.');
}

module.exports = ensureAuthenticated;
