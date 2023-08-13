const express = require('express');
const router = express.Router();
const pool = require('../config/database');


router.get('/:id', async function (req, res) {
    try {
        const sqlQuery = `SELECT * FROM society WHERE id=${req.params.id}`;
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json(error);
    }

});

router.get('/', async function (req, res) {
    try {
        const sqlQuery = 'SELECT * FROM society';
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;