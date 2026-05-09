const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message);

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Error de validación', detalles: mensajes });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'El valor ya existe en la base de datos' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID inválido' });
  }

  res.status(err.statusCode || 500).json({
    error: err.message || 'Error interno del servidor',
  });
};

module.exports = errorHandler;