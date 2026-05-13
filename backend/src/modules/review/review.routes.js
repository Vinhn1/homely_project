import express from 'express';
import * as reviewController from './review.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', reviewController.getPropertyReviews);

// Protected routes
router.use(protect);
router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

export default router;
