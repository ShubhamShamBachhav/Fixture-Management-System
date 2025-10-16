// controllers/image.controller.js
import db from '../db/connection.js';

const query = (sql, params=[]) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

export const getImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const rows = await query("SELECT IMAGE FROM OCTA_SPACE_FIXTURE_IMAGES WHERE IMAGE_ID = ?", [imageId]);
    if (!rows.length) return res.status(404).send('Not found');

    const img = rows[0].IMAGE;
    // send as image/png (we don't know type reliably; use octet-stream)
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(img);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching image');
  }
};

export const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    await query("DELETE FROM OCTA_SPACE_FIXTURE_IMAGES WHERE IMAGE_ID = ?", [id]);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
