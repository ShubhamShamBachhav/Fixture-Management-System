// controllers/fixture.controller.js
import db from '../db/connection.js';

// Promise-based MySQL helper
const query = (sql, params = []) => new Promise((resolve, reject) => {
  db.query(sql, params, (err, results) => {
    if (err) return reject(err);
    resolve(results);
  });
});

// helper: convert many incoming date formats (ISO, "YYYY-MM-DD", etc.)
// to MySQL DATETIME string "YYYY-MM-DD HH:mm:ss"
// returns null for empty/invalid input
function formatDateToMySQL(dateInput) {
  if (dateInput === undefined || dateInput === null || dateInput === '') return null;

  // If value already looks like a MySQL datetime (quick check), return as-is
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/.test(dateInput)) {
    // if missing time, add 00:00:00
    return dateInput.length === 10 ? `${dateInput} 00:00:00` : dateInput.split('T').join(' ');
  }

  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;

  // adjust for local timezone and format
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 19).replace('T', ' ');
}

// ======================================================
// GET ALL FIXTURES
// ======================================================
export const getFixtures = async (req, res) => {
  try {
    const {
      FIXTURE_ID,
      FIXTURE_DESCR,
      FIXTURE_TYPE,
      FIXTURE_CODE,
      FIXTURE_LOCATION,
      FIXTURE_CATEGORY,
      FIXTURE_UNIQUE_IDENTIFIER
    } = req.query;

    let sql = "SELECT * FROM OCTA_SPACE_FIXTURE WHERE 1=1";
    const params = [];

    if (FIXTURE_ID) { sql += " AND FIXTURE_ID = ?"; params.push(FIXTURE_ID); }
    if (FIXTURE_DESCR) { sql += " AND FIXTURE_DESCR LIKE ?"; params.push(`%${FIXTURE_DESCR}%`); }
    if (FIXTURE_TYPE) { sql += " AND FIXTURE_TYPE LIKE ?"; params.push(`%${FIXTURE_TYPE}%`); }
    if (FIXTURE_CODE) { sql += " AND FIXTURE_CODE LIKE ?"; params.push(`%${FIXTURE_CODE}%`); }
    if (FIXTURE_LOCATION) { sql += " AND FIXTURE_LOCATION LIKE ?"; params.push(`%${FIXTURE_LOCATION}%`); }
    if (FIXTURE_CATEGORY) { sql += " AND FIXTURE_CATEGORY LIKE ?"; params.push(`%${FIXTURE_CATEGORY}%`); }
    if (FIXTURE_UNIQUE_IDENTIFIER) { sql += " AND FIXTURE_UNIQUE_IDENTIFIER LIKE ?"; params.push(`%${FIXTURE_UNIQUE_IDENTIFIER}%`); }

    const results = await query(sql, params);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
};

// ======================================================
// GET FIXTURE BY ID
// ======================================================
export const getFixtureById = async (req, res) => {
  try {
    const id = req.params.id;
    const fixtureRows = await query("SELECT * FROM OCTA_SPACE_FIXTURE WHERE FIXTURE_ID = ?", [id]);
    if (!fixtureRows.length) return res.status(404).json({ error: 'Fixture not found' });

    const images = await query(
      "SELECT IMAGE_ID, IMAGE_DESCR, CREATED_BY, CREATED_DT, UPDATED_AT FROM OCTA_SPACE_FIXTURE_IMAGES WHERE FIXTURE_ID = ?",
      [id]
    );

    const categories = await query(
      "SELECT FIXTURE_CATEGORY, ALLOCATED_SPACE, ELASTICITY_COEFFICIENT FROM OCTA_SPACE_FIXTURE_CATEGORIES WHERE FIXTURE_ID = ?",
      [id]
    );

    res.json({ fixture: fixtureRows[0], images, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch fixture' });
  }
};

// ======================================================
// ADD FIXTURE
// ======================================================
export const addFixture = async (req, res) => {
  try {
    const fixture = req.body;

    fixture.FIXTURE_AVAIL_FOR_RENT =
      fixture.FIXTURE_AVAIL_FOR_RENT === 'true' || fixture.FIXTURE_AVAIL_FOR_RENT === true ? 1 : 0;

    // Insert fixture data
    const insert = await query("INSERT INTO OCTA_SPACE_FIXTURE SET ?", fixture);
    const newId = insert.insertId;

    // Insert images (if any)
    if (req.files && req.files.length) {
      for (const f of req.files) {
        await query(
          "INSERT INTO OCTA_SPACE_FIXTURE_IMAGES (FIXTURE_ID, IMAGE, IMAGE_DESCR, CREATED_BY) VALUES (?, ?, ?, ?)",
          [newId, f.buffer, f.originalname, req.body.CREATED_BY || 'system']
        );
      }
    }

    // Insert categories
    if (fixture.categories) {
      let cats = [];
      try { cats = JSON.parse(fixture.categories); } catch (e) { cats = []; }
      for (const c of cats) {
        await query(
          "INSERT INTO OCTA_SPACE_FIXTURE_CATEGORIES (FIXTURE_ID, FIXTURE_CATEGORY, ALLOCATED_SPACE, ELASTICITY_COEFFICIENT) VALUES (?, ?, ?, ?)",
          [newId, c.FIXTURE_CATEGORY, c.ALLOCATED_SPACE || 0, c.ELASTICITY_COEFFICIENT || 0]
        );
      }
    }

    res.json({ message: 'Fixture created', id: newId });
  } catch (err) {
    console.error('❌ Failed to add fixture:', err);
    res.status(500).json({ error: 'Failed to add fixture' });
  }
};

// ======================================================
// UPDATE FIXTURE (fixed version)
// ======================================================
export const updateFixture = async (req, res) => {
  try {
    const id = req.params.id;
    const fixture = req.body || {};

    // normalize boolean
    fixture.FIXTURE_AVAIL_FOR_RENT =
      fixture.FIXTURE_AVAIL_FOR_RENT === 'true' || fixture.FIXTURE_AVAIL_FOR_RENT === true ? 1 : 0;

    // Build dynamic update query (ignore categories/images fields)
    const updateKeys = Object.keys(fixture).filter(k => k !== 'categories' && k !== 'images');

    // If no updatable keys present, skip DB update
    if (updateKeys.length > 0) {
      const updateValues = updateKeys.map(k => {
        // Convert dates to MySQL format for START_DATE / END_DATE
        if (k === 'START_DATE' || k === 'END_DATE') {
          return formatDateToMySQL(fixture[k]);
        }
        // For empty strings that you prefer to be null in DB:
        if (fixture[k] === '') return null;
        return fixture[k];
      });

      const setClause = updateKeys.map(k => `${k} = ?`).join(', ');
      await query(`UPDATE OCTA_SPACE_FIXTURE SET ${setClause} WHERE FIXTURE_ID = ?`, [...updateValues, id]);
    }

    // Handle new images (if multipart form sent)
    if (req.files && req.files.length) {
      for (const f of req.files) {
        await query(
          "INSERT INTO OCTA_SPACE_FIXTURE_IMAGES (FIXTURE_ID, IMAGE, IMAGE_DESCR, CREATED_BY) VALUES (?, ?, ?, ?)",
          [id, f.buffer, f.originalname, req.body.CREATED_BY || 'system']
        );
      }
    }

    // Handle categories (replace existing)
    if (fixture.categories) {
      let cats = [];
      try { cats = JSON.parse(fixture.categories); } catch (e) { cats = []; }
      await query("DELETE FROM OCTA_SPACE_FIXTURE_CATEGORIES WHERE FIXTURE_ID = ?", [id]);
      for (const c of cats) {
        await query(
          "INSERT INTO OCTA_SPACE_FIXTURE_CATEGORIES (FIXTURE_ID, FIXTURE_CATEGORY, ALLOCATED_SPACE, ELASTICITY_COEFFICIENT) VALUES (?, ?, ?, ?)",
          [id, c.FIXTURE_CATEGORY, c.ALLOCATED_SPACE || 0, c.ELASTICITY_COEFFICIENT || 0]
        );
      }
    }

    res.json({ message: 'Fixture updated successfully' });
  } catch (err) {
    console.error('❌ Error updating fixture:', err);
    res.status(500).json({ error: 'Failed to update fixture' });
  }
};

// ======================================================
// DELETE FIXTURE
// ======================================================
export const deleteFixture = async (req, res) => {
  try {
    const id = req.params.id;
    await query("DELETE FROM OCTA_SPACE_FIXTURE WHERE FIXTURE_ID = ?", [id]);
    res.json({ message: 'Fixture deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete fixture' });
  }
};
