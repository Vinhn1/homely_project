import express from 'express';
import * as bookingController from './booking.controller.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', bookingController.createBooking);
router.get('/my-bookings', bookingController.getMyBookings);
router.get('/owner-requests', bookingController.getOwnerBookings);
router.patch('/:id/status', bookingController.updateBookingStatus);

export default router;
