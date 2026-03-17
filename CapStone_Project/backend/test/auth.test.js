const request    = require('supertest');
const { expect } = require('chai');
const app        = require('../app');
const { clearDatabase, seedRoles } = require('./helpers/db');

const validUser = {
  name: 'Test User', email: 'testuser@example.com',
  phone: '9876543210', password: 'password123'
};

beforeEach(async () => {
  await clearDatabase();
  await seedRoles();
});

describe('Auth Routes', () => {

  describe('POST /api/auth/register', () => {

    it('should register a new user and return 201', async () => {
      const res = await request(app).post('/api/auth/register').send(validUser);
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('message', 'Registered successfully');
    });

    it('should return 400 when email is already taken', async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app).post('/api/auth/register').send(validUser);
      expect(res.status).to.equal(400);
    });

    it('should return 400 when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incomplete@example.com' });
      expect(res.status).to.equal(400);
    });

  });

  describe('POST /api/auth/login', () => {

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('should login successfully and return a token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('role', 'user');
    });

    it('should return 400 for wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'wrongpassword' });
      expect(res.status).to.equal(400);
    });

    it('should return 400 for non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' });
      expect(res.status).to.equal(400);
    });

  });

  describe('GET /api/auth/profile', () => {

    let token;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });
      token = res.body.token;
    });

    it('should return user profile for authenticated user', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('email', validUser.email);
      expect(res.body).to.not.have.property('password');
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).to.equal(401);
    });

    it('should return 401 for an invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtoken123');
      expect(res.status).to.equal(401);
    });

  });

});