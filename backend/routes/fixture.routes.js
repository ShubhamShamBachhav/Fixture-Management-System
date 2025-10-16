// routes/fixture.routes.js
import express from 'express';
import { getFixtures, addFixture, updateFixture, deleteFixture, getFixtureById } from '../controllers/fixture.controller.js';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getFixtures);
router.get('/:id', getFixtureById);
router.post('/', upload.array('images'), addFixture);
// router.put('/:id', upload.array('images'), updateFixture);
router.put('/:id', updateFixture);
router.delete('/:id', deleteFixture);

export default router;
