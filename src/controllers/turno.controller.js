const turnoService = require('../services/turno.service');

const crear = async (req, res) => {
  const turno = await turnoService.crear(req.body, req.usuario._id);
  res.status(201).json(turno);
};

const misTurnos = async (req, res) => {
  const turnos = await turnoService.listarPorPaciente(req.usuario._id);
  res.json(turnos);
};

const listarTodos = async (req, res) => {
  const turnos = await turnoService.listarTodos(req.query);
  res.json(turnos);
};

const obtenerPorId = async (req, res) => {
  const turno = await turnoService.obtenerPorId(req.params.id);
  res.json(turno);
};

const actualizar = async (req, res) => {
  const turno = await turnoService.actualizar(req.params.id, req.body);
  res.json(turno);
};

const actualizarEstado = async (req, res) => {
  const turno = await turnoService.actualizarEstado(req.params.id, req.body.estado);
  res.json(turno);
};

module.exports = { crear, misTurnos, listarTodos, obtenerPorId, actualizar, actualizarEstado };