// routes/category.routes.js
import express from 'express';
import { getCategoriesByFixture } from '../controllers/category.controller.js';
const router = express.Router();

router.get('/:fixtureId', getCategoriesByFixture);

export default router;
