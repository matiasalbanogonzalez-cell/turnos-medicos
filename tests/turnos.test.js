const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const Turno = require('../src/models/Turno');

let tokenCliente;
let tokenAdmin;
let profesional;
let turnoCreado;

const crearUsuario = async (datos) => {
  const res = await request(app).post('/api/auth/register').send(datos);
  return res;
};

beforeEach(async () => {
  const adminRes = await crearUsuario({
    email: 'admin@test.com',
    password: '123456',
    nombre: 'Admin',
    apellido: 'Sistema',
  });
  tokenAdmin = adminRes.body.token;

  const profRes = await crearUsuario({
    email: 'profesional@test.com',
    password: '123456',
    nombre: 'Dr. Juan',
    apellido: 'López',
  });
  profesional = profRes.body.usuario;

  const clienteRes = await crearUsuario({
    email: 'cliente@test.com',
    password: '123456',
    nombre: 'Pedro',
    apellido: 'García',
  });
  tokenCliente = clienteRes.body.token;
});

describe('Turnos - Cliente', () => {
  test('Crear turno exitoso → 201', async () => {
    const res = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        fecha: '2026-06-15',
        hora: '10:30',
        profesional: profesional._id,
        especialidad: 'Cardiología',
        motivo: 'Consulta de rutina',
      });

    expect(res.status).toBe(201);
    expect(res.body.especialidad).toBe('Cardiología');
    expect(res.body.estado).toBe('pendiente');
    turnoCreado = res.body;
  });

  test('Crear turno sin autenticación → 401', async () => {
    const res = await request(app)
      .post('/api/turnos')
      .send({
        fecha: '2026-06-15',
        hora: '10:30',
        profesional: profesional._id,
        especialidad: 'Cardiología',
      });

    expect(res.status).toBe(401);
  });

  test('Crear turno con fecha pasada → 400', async () => {
    const res = await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        fecha: '2020-01-01',
        hora: '10:30',
        profesional: profesional._id,
        especialidad: 'Cardiología',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Datos inválidos');
  });

  test('Ver mis turnos → 200 + array', async () => {
    await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        fecha: '2026-06-15',
        hora: '10:30',
        profesional: profesional._id,
        especialidad: 'Cardiología',
      });

    const res = await request(app)
      .get('/api/turnos/mis-turnos')
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  test('Cliente NO puede ver todos los turnos → 403', async () => {
    const res = await request(app)
      .get('/api/turnos')
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.status).toBe(403);
  });
});

describe('Turnos - Admin', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/turnos')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({
        fecha: '2026-06-15',
        hora: '10:30',
        profesional: profesional._id,
        especialidad: 'Cardiología',
      });
  });

  test('Admin puede ver todos los turnos → 200', async () => {
    const res = await request(app)
      .get('/api/turnos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('Admin puede cambiar estado → 200', async () => {
    const turnos = await request(app)
      .get('/api/turnos')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    const turnoId = turnos.body[0]._id;

    const res = await request(app)
      .patch(`/api/turnos/${turnoId}/estado`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ estado: 'confirmado' });

    expect(res.status).toBe(200);
    expect(res.body.estado).toBe('confirmado');
  });

  test('Cambiar estado a turno inexistente → 404', async () => {
    const fakeId = '000000000000000000000000';
    const res = await request(app)
      .patch(`/api/turnos/${fakeId}/estado`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ estado: 'cancelado' });

    expect(res.status).toBe(404);
  });

  test('Filtrar turnos por especialidad', async () => {
    const res = await request(app)
      .get('/api/turnos?especialidad=Cardiología')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].especialidad).toBe('Cardiología');
  });
});