import express from 'express';
import * as wishlistController from './wishlist.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.get('/check/:propertyId', wishlistController.checkWishlist);
router.post('/toggle/:propertyId', wishlistController.toggleWishlist);

export default router;
