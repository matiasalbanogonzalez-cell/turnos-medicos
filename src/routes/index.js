const { Router } = require('express');
const authRoutes = require('./auth.routes');
const turnoRoutes = require('./turno.routes');
const usuarioRoutes = require('./usuario.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/turnos', turnoRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;