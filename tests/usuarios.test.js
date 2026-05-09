const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { connect, disconnect, clearData } = require('./setup');

beforeAll(connect);
afterAll(disconnect);
afterEach(clearData);

let tokenAdmin;
let tokenCliente;

beforeEach(async () => {
  const adminRes = await request(app).post('/api/auth/register').send({
    email: 'admin@test.com',
    password: '123456',
    nombre: 'Admin',
    apellido: 'Sistema',
  });
  tokenAdmin = adminRes.body.token;

  const clienteRes = await request(app).post('/api/auth/register').send({
    email: 'cliente@test.com',
    password: '123456',
    nombre: 'Pedro',
    apellido: 'García',
  });
  tokenCliente = clienteRes.body.token;
});

describe('Usuarios - Admin', () => {
  test('Listar usuarios → 200 + array', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('Cliente no puede listar usuarios → 403', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenCliente}`);

    expect(res.status).toBe(403);
  });

  test('Obtener usuario por ID → 200', async () => {
    const usuarios = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    const res = await request(app)
      .get(`/api/usuarios/${usuarios.body[0]._id}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBeDefined();
  });

  test('Desactivar usuario → 200', async () => {
    const usuarios = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    const target = usuarios.body.find((u) => u.email === 'cliente@test.com');

    const res = await request(app)
      .delete(`/api/usuarios/${target._id}`)
      .set('Authorization', `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toContain('desactivado');
  });
});