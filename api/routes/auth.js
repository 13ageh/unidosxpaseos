const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const router = express.Router();

// Ruta POST para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validación básica de entrada
    if (!email || !password) {
        return res.status(400).json({ error: 'Por favor, ingresa tu correo y contraseña.' });
    }

    try {
        // 1. Buscar al usuario en la base de datos
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            // Por seguridad, no decimos si el correo existe o no
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];

        // 2. Verificar si la cuenta está bloqueada (CU-01 FA2)
        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            return res.status(403).json({ 
                error: 'Cuenta bloqueada temporalmente por seguridad. Reintente en 15 minutos.' 
            });
        }

        // 3. Verificar si la cuenta está activa (CU-01 FA3)
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Su cuenta no se encuentra activa. Contacte a la administración.' });
        }

        // 4. Comparar la contraseña enviada con el hash de la BD
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            // Lógica de intentos fallidos
            const attempts = user.failed_login_attempts + 1;
            let lockDate = null;
            
            if (attempts >= 5) {
                lockDate = new Date(Date.now() + 15 * 60000); // Bloquear 15 mins
            }
            
            await pool.query(
                'UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?', 
                [attempts, lockDate, user.id]
            );
            
            return res.status(401).json({ error: 'Credenciales inválidas. Intente nuevamente.' });
        }

        // 5. Login exitoso: Resetear intentos fallidos
        await pool.query(
            'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?', 
            [user.id]
        );

        // 6. Generar el Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.first_name },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // El token dura 2 horas
        );

        // 7. Responder al frontend
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;