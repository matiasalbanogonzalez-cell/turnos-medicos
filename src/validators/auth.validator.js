const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email es requerido',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos 6 caracteres',
    'any.required': 'Contraseña es requerida',
  }),
  nombre: Joi.string().trim().min(1).required().messages({
    'any.required': 'Nombre es requerido',
  }),
  apellido: Joi.string().trim().min(1).required().messages({
    'any.required': 'Apellido es requerido',
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email es requerido',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Contraseña es requerida',
  }),
});

module.exports = { registerSchema, loginSchema };