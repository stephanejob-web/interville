const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');
const { authenticateToken } = require('../middleware/auth');

router.get('/challenges', authenticateToken, challengeController.getAllChallenges);
router.get('/challenges/:id', authenticateToken, challengeController.getChallengeById);
router.post('/challenges', authenticateToken, challengeController.createChallenge);
router.put('/challenges/:id', authenticateToken, challengeController.updateChallenge);
router.delete('/challenges/:id', authenticateToken, challengeController.deleteChallenge);

router.post('/challenges/:id/like', authenticateToken, challengeController.likeChallenge);
router.get('/challenges/:id/participants', authenticateToken, challengeController.getParticipants);

module.exports = router;