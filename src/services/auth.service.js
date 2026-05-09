const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async ({ email, password, nombre, apellido }) => {
  const existe = await User.findOne({ email });
  if (existe) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 400;
    throw error;
  }

  const usuario = await User.create({ email, password, nombre, apellido });
  const token = generarToken(usuario);
  return { usuario, token };
};

const login = async ({ email, password }) => {
  const usuario = await User.findOne({ email }).select('+password');
  if (!usuario) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const coincide = await usuario.compararPassword(password);
  if (!coincide) {
    const error = new Error('Credenciales inválidas');
    error.statusCode = 401;
    throw error;
  }

  const token = generarToken(usuario);
  return { usuario, token };
};

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, role: usuario.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

module.exports = { register, login };