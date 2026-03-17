const request    = require('supertest');
const { expect } = require('chai');
const app        = require('../app');
const { clearDatabase, seedRoles } = require('./helpers/db');
const Album         = require('../models/Album');
const Artist        = require('../models/Artist');
const MusicDirector = require('../models/MusicDirector');

describe('Song Routes', () => {

  let userToken, adminToken;
  let albumId, artistId, directorId;

  beforeEach(async () => {
    await clearDatabase();
    await seedRoles();

    await request(app).post('/api/auth/register').send({
      name: 'Regular User', email: 'user@example.com',
      phone: '9000000001', password: 'password123'
    });
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@example.com', password: 'password123' });
    userToken = userRes.body.token;

    const Role   = require('../models/Role');
    const User   = require('../models/User');
    const bcrypt = require('bcryptjs');
    const adminRole = await Role.findOne({ roleName: 'admin' });
    await User.create({
      name: 'Admin', email: 'admin@example.com', phone: '9000000002',
      password: await bcrypt.hash('adminpass', 10), roleId: adminRole._id
    });
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'adminpass' });
    adminToken = adminRes.body.token;

    const album    = await Album.create({ albumName: 'Test Album' });
    const artist   = await Artist.create({ artistName: 'Test Artist' });
    const director = await MusicDirector.create({ directorName: 'Test Director' });
    albumId    = album._id;
    artistId   = artist._id;
    directorId = director._id;
  });

  describe('GET /api/songs', () => {

    it('should return all visible songs for authenticated user', async () => {
      const res = await request(app)
        .get('/api/songs')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app).get('/api/songs');
      expect(res.status).to.equal(401);
    });

    it('should filter songs by name using search query', async () => {
      const res = await request(app)
        .get('/api/songs?search=nonexistentsong')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').that.is.empty;
    });

  });

  describe('GET /api/songs/admin/all', () => {

    it('should return all songs including hidden for admin', async () => {
      const res = await request(app)
        .get('/api/songs/admin/all')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
    });

    it('should return 403 when called by a regular user', async () => {
      const res = await request(app)
        .get('/api/songs/admin/all')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(403);
    });

  });

  describe('POST /api/songs', () => {

    it('should return 403 when a regular user tries to add a song', async () => {
      const res = await request(app)
        .post('/api/songs')
        .set('Authorization', `Bearer ${userToken}`)
        .field('songName', 'Unauthorized Song')
        .field('albumId', albumId.toString())
        .field('directorId', directorId.toString())
        .field('artistId', JSON.stringify([artistId.toString()]));
      expect(res.status).to.equal(403);
    });

    it('should return 400 when song file is missing', async () => {
      const res = await request(app)
        .post('/api/songs')
        .set('Authorization', `Bearer ${adminToken}`)
        .field('songName', 'No File Song')
        .field('albumId', albumId.toString())
        .field('directorId', directorId.toString())
        .field('artistId', JSON.stringify([artistId.toString()]));
      expect(res.status).to.equal(400);
      expect(res.body.message).to.include('required');
    });

  });

  describe('PATCH /api/songs/:id/visibility', () => {

    it('should return 403 when a regular user tries to toggle visibility', async () => {
      const Song = require('../models/Song');
      const song = await Song.create({
        songName: 'Hidden Song', albumId, directorId,
        artistId: [artistId], filePath: 'uploads/songs/test.mp3'
      });
      const res = await request(app)
        .patch(`/api/songs/${song._id}/visibility`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(403);
    });

  });

});