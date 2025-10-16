// controllers/category.controller.js
import db from '../db/connection.js';

const query = (sql, params=[]) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

export const getCategoriesByFixture = async (req, res) => {
  try {
    const id = req.params.fixtureId;
    const rows = await query("SELECT * FROM OCTA_SPACE_FIXTURE_CATEGORIES WHERE FIXTURE_ID = ?", [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
