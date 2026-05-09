const authService = require('../services/auth.service');

const register = async (req, res) => {
  const { usuario, token } = await authService.register(req.body);
  res.status(201).json({ usuario, token });
};

const login = async (req, res) => {
  const { usuario, token } = await authService.login(req.body);
  res.json({ usuario, token });
};

const me = async (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { register, login, me };