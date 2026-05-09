const { Router } = require('express');
const { listar, obtener, actualizar, desactivar } = require('../controllers/usuario.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', actualizar);
router.delete('/:id', desactivar);

module.exports = router;