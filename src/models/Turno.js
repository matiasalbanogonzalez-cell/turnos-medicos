const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
  },
  hora: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  profesional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  especialidad: {
    type: String,
    required: true,
    trim: true,
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'],
    default: 'pendiente',
  },
  motivo: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

turnoSchema.index({ profesional: 1, fecha: 1, hora: 1 });
turnoSchema.index({ paciente: 1 });
turnoSchema.index({ especialidad: 1 });

module.exports = mongoose.model('Turno', turnoSchema);