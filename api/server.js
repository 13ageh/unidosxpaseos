const express = require('express');
const cors = require('cors');
require('dotenv').config();
const eventRoutes = require('./routes/events'); // Agrega esta línea

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors()); // Permite peticiones desde tu frontend
app.use(express.json()); // Permite leer JSON en las peticiones

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Ruta de prueba para ver si el servidor está vivo
app.get('/', (req, res) => {
    res.send('API de Unidos por Paseos funcionando correctamente 🚀');
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});