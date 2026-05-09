const User = require('../models/User');

const listar = async (req, res) => {
  const usuarios = await User.find({ activo: true });
  res.json(usuarios);
};

const obtener = async (req, res) => {
  const usuario = await User.findById(req.params.id);
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(usuario);
};

const actualizar = async (req, res) => {
  const { nombre, apellido, email, role } = req.body;
  const usuario = await User.findByIdAndUpdate(
    req.params.id,
    { nombre, apellido, email, role },
    { new: true, runValidators: true }
  );
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json(usuario);
};

const desactivar = async (req, res) => {
  const usuario = await User.findByIdAndUpdate(
    req.params.id,
    { activo: false },
    { new: true }
  );
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json({ mensaje: 'Usuario desactivado correctamente' });
};

module.exports = { listar, obtener, actualizar, desactivar };