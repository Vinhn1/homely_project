import express from 'express';
import * as amenityController from './amenity.controller.js';

const router = express.Router();

router.get('/', amenityController.getAllAmenities);
router.post('/', amenityController.createAmenity);

export default router;
