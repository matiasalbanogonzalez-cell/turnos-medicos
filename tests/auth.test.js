const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const { connect, disconnect, clearData } = require('./setup');

beforeAll(connect);
afterAll(disconnect);
afterEach(clearData);

const usuarioValido = {
  email: 'test@example.com',
  password: '123456',
  nombre: 'Juan',
  apellido: 'Pérez',
};

describe('Auth - Registro', () => {
  test('Registro exitoso → 201 + token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(usuarioValido);

    expect(res.status).toBe(201);
    expect(res.body.usuario).toBeDefined();
    expect(res.body.usuario.email).toBe(usuarioValido.email);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario).not.toHaveProperty('password');
  });

  test('Registro con email duplicado → 400', async () => {
    await User.create(usuarioValido);
    const res = await request(app)
      .post('/api/auth/register')
      .send(usuarioValido);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('email ya está registrado');
  });

  test('Registro con datos inválidos → 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'invalido', password: '12' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Datos inválidos');
  });
});

describe('Auth - Login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(usuarioValido);
  });

  test('Login exitoso → 200 + token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioValido.email, password: usuarioValido.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Login con credenciales inválidas → 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: usuarioValido.email, password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });
});

describe('Auth - GET /me', () => {
  test('Sin token → 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Token no proporcionado');
  });

  test('Con token válido → 200 + usuario', async () => {
    const reg = await request(app).post('/api/auth/register').send(usuarioValido);
    const token = reg.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.usuario.email).toBe(usuarioValido.email);
  });
});