const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/categories', authenticateToken, categoryController.getAllCategories);

module.exports = router;