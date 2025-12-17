const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/admin/users', authenticateToken, requireAdmin, adminController.getAllUsers);
router.get('/admin/pending-users', authenticateToken, requireAdmin, adminController.getPendingUsers);

module.exports = router;