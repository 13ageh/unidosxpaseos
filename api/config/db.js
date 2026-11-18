const mysql = require('mysql2/promise');
require('dotenv').config();

// Creamos un "pool" de conexiones (es más eficiente que abrir y cerrar una conexión por cada consulta)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión exitosa a la base de datos MySQL');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error conectando a la base de datos:', err.message);
    });

module.exports = pool;