const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false, stripUnknown: true });
    if (error) {
      const mensajes = error.details.map((d) => d.message);
      return res.status(400).json({ error: 'Datos inválidos', detalles: mensajes });
    }
    req[property] = value;
    next();
  };
};

module.exports = validate;