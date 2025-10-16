// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fixtureRoutes from './routes/fixture.routes.js';
import imageRoutes from './routes/image.routes.js';
import categoryRoutes from './routes/category.routes.js';
import path from 'path';
import fs from 'fs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// create uploads folder if missing
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/fixtures', fixtureRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => res.send('Fixture Master API is running'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
