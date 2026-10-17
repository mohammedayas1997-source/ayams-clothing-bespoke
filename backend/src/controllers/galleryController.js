const db = require('../config/db');

// Aika dukkan hotuna da bidiyoyi (Showcase Catalog)
exports.getAllStyles = async (req, res) => {
  try {
    const { category, media_type } = req.query; // Zaɓi: Male, Female, video, image
    let queryText = 'SELECT * FROM styles_gallery WHERE is_active = TRUE';
    const params = [];

    if (category) {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }
    if (media_type) {
      params.push(media_type);
      queryText += ` AND media_type = $${params.length}`;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await db.query(queryText, params);
    res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen daukowa', error: error.message });
  }
};

// Saka sabon hoto ko bidiyo a gallery
exports.addStyle = async (req, res) => {
  try {
    const { title, category, media_type, media_url, thumbnail_url, description, base_price } = req.body;

    if (!title || !category || !media_type || !media_url) {
      return res.status(400).json({ success: false, message: 'Cika dukkan muhimman bayanai (title, category, media_type, media_url).' });
    }

    const queryText = `
      INSERT INTO styles_gallery (title, category, media_type, media_url, thumbnail_url, description, base_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [title, category, media_type, media_url, thumbnail_url || null, description || null, base_price || 0.00];

    const result = await db.query(queryText, values);
    res.status(201).json({ success: true, message: 'An dora sabon salo cikin nasara!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen ajiye salo', error: error.message });
  }
};
// Gyara Hoto/Bidiyo ko Farashi (Edit Style)
exports.updateStyle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, media_type, media_url, thumbnail_url, description, base_price } = req.body;

    const queryText = `
      UPDATE styles_gallery
      SET 
        title = COALESCE($1, title),
        category = COALESCE($2, category),
        media_type = COALESCE($3, media_type),
        media_url = COALESCE($4, media_url),
        thumbnail_url = COALESCE($5, thumbnail_url),
        description = COALESCE($6, description),
        base_price = COALESCE($7, base_price)
      WHERE id = $8
      RETURNING *;
    `;
    const values = [title, category, media_type, media_url, thumbnail_url, description, base_price, id];

    const result = await db.query(queryText, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ba a sami wannan salon ba.' });
    }

    res.status(200).json({ success: true, message: 'An sabunta bayanan salo!', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure wajen sabuntawa', error: error.message });
  }
};

// Cire salo (Deactivate)
exports.deleteStyle = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE styles_gallery SET is_active = FALSE WHERE id = $1', [id]);
    res.status(200).json({ success: true, message: 'An cire wannan salon daga gallery.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Kuskure', error: error.message });
  }
};