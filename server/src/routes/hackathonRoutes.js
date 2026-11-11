import express from 'express';
import {
  registerHackathon,
  getMyEntry,
  deleteEntry,
} from '../controllers/hackathonController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All hackathon routes are protected by JWT middleware
router.post('/register', protect, registerHackathon);
router.get('/my-entry', protect, getMyEntry);
router.delete('/:id', protect, deleteEntry);

export default router;
