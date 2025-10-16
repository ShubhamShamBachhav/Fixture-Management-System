// routes/image.routes.js
import express from 'express';
import { getImage, deleteImage } from '../controllers/image.controller.js';
const router = express.Router();

router.get('/:id', getImage);      // GET image by IMAGE_ID
router.delete('/:id', deleteImage);

export default router;
