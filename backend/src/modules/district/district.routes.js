import express from 'express';
import * as districtController from './district.controller.js';

const router = express.Router();

router.get('/', districtController.getAllDistricts);
router.post('/', districtController.createDistrict);

export default router;
