const express = require('express');
const pool = require('../config/db');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [events] = await pool.query('SELECT * FROM events ORDER BY created_at DESC');
        res.json(events);
    } catch (error) { res.status(500).json({ error: 'Error al obtener eventos' }); }
});

router.post('/', async (req, res) => {
    const { id, title, tag, dateDay, dateMonth, location, time, desc, image, featured } = req.body;
    try {
        await pool.query(
            'INSERT INTO events (id, title, tag, dateDay, dateMonth, location, time, description, image_url, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, title, tag, dateDay, dateMonth, location, time, desc, image, featured]
        );
        res.status(201).json({ message: 'Evento creado' });
    } catch (error) { res.status(500).json({ error: 'Error al crear evento' }); }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, tag, dateDay, dateMonth, location, time, desc, image, featured } = req.body;
    try {
        await pool.query(
            'UPDATE events SET title = ?, tag = ?, dateDay = ?, dateMonth = ?, location = ?, time = ?, description = ?, image_url = ?, is_featured = ? WHERE id = ?',
            [title, tag, dateDay, dateMonth, location, time, desc, image, featured, id]
        );
        res.json({ message: 'Evento actualizado' });
    } catch (error) { res.status(500).json({ error: 'Error al actualizar evento' }); }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM events WHERE id = ?', [id]);
        res.json({ message: 'Evento eliminado' });
    } catch (error) { res.status(500).json({ error: 'Error al eliminar evento' }); }
});

module.exports = router;