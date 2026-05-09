const { Router } = require('express');
const {
  crear, misTurnos, listarTodos,
  obtenerPorId, actualizar, actualizarEstado,
} = require('../controllers/turno.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { crearTurnoSchema, actualizarEstadoSchema } = require('../validators/turno.validator');

const router = Router();

router.use(authenticate);

router.post('/', authorize('cliente'), validate(crearTurnoSchema), crear);
router.get('/mis-turnos', authorize('cliente'), misTurnos);
router.get('/', authorize('admin'), listarTodos);
router.get('/:id', obtenerPorId);
router.put('/:id', authorize('admin'), actualizar);
router.patch('/:id/estado', authorize('admin'), validate(actualizarEstadoSchema), actualizarEstado);

module.exports = router;