const Turno = require('../models/Turno');

const crear = async (data, pacienteId) => {
  const turno = await Turno.create({ ...data, paciente: pacienteId });
  return turno.populate(['profesional', 'paciente']);
};

const listarPorPaciente = async (pacienteId) => {
  return Turno.find({ paciente: pacienteId })
    .populate('profesional', 'nombre apellido email')
    .sort({ fecha: -1 });
};

const listarTodos = async (filtros = {}) => {
  const query = {};
  if (filtros.especialidad) query.especialidad = filtros.especialidad;
  if (filtros.profesional) query.profesional = filtros.profesional;
  if (filtros.estado) query.estado = filtros.estado;
  if (filtros.fecha) query.fecha = new Date(filtros.fecha);

  return Turno.find(query)
    .populate('profesional', 'nombre apellido email')
    .populate('paciente', 'nombre apellido email')
    .sort({ fecha: -1 });
};

const obtenerPorId = async (id) => {
  const turno = await Turno.findById(id).populate(['profesional', 'paciente']);
  if (!turno) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return turno;
};

const actualizarEstado = async (id, estado) => {
  const turno = await Turno.findByIdAndUpdate(
    id,
    { estado },
    { new: true, runValidators: true }
  ).populate(['profesional', 'paciente']);

  if (!turno) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return turno;
};

const actualizar = async (id, data) => {
  const turno = await Turno.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate(['profesional', 'paciente']);

  if (!turno) {
    const error = new Error('Turno no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return turno;
};

module.exports = {
  crear,
  listarPorPaciente,
  listarTodos,
  obtenerPorId,
  actualizarEstado,
  actualizar,
};