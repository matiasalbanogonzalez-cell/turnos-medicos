const Joi = require('joi');

const crearTurnoSchema = Joi.object({
  fecha: Joi.date().iso().min('now').required().messages({
    'date.format': 'Fecha debe tener formato ISO (YYYY-MM-DD)',
    'date.min': 'La fecha no puede ser pasada',
    'any.required': 'Fecha es requerida',
  }),
  hora: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
      'string.pattern.base': 'Hora debe tener formato HH:mm',
      'any.required': 'Hora es requerida',
    }),
  profesional: Joi.string().length(24).hex().required().messages({
    'string.length': 'ID de profesional inválido',
    'any.required': 'Profesional es requerido',
  }),
  especialidad: Joi.string().trim().min(1).required().messages({
    'any.required': 'Especialidad es requerida',
  }),
  motivo: Joi.string().trim().allow('').optional(),
});

const actualizarEstadoSchema = Joi.object({
  estado: Joi.string()
    .valid('confirmado', 'cancelado')
    .required()
    .messages({
      'any.only': 'Estado debe ser confirmado o cancelado',
      'any.required': 'Estado es requerido',
    }),
});

module.exports = { crearTurnoSchema, actualizarEstadoSchema };