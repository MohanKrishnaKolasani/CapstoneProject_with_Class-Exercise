const request    = require('supertest');
const { expect } = require('chai');
const app        = require('../app');
const { clearDatabase, seedRoles } = require('./helpers/db');

describe('Playlist Routes', () => {

  let userToken;
  let playlistId;

  beforeEach(async () => {
    await clearDatabase();
    await seedRoles();

    await request(app).post('/api/auth/register').send({
      name: 'Playlist User', email: 'playlist@example.com',
      phone: '9000000003', password: 'password123'
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'playlist@example.com', password: 'password123' });
    userToken = res.body.token;
  });

  describe('GET /api/playlists/:id', () => {

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'Single Fetch' });
      playlistId = res.body._id;
    });

    it('should return a single playlist by id', async () => {
      const res = await request(app)
        .get(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('playlistName', 'Single Fetch');
    });

    it('should return 404 for a non-existent playlist id', async () => {
      const fakeId = '64f1a2b3c4d5e6f7a8b9c0d1';
      const res = await request(app)
        .get(`/api/playlists/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(404);
    });

  });

  describe('POST /api/playlists', () => {

    it('should create a new playlist', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'My Favourites' });
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('playlistName', 'My Favourites');
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .send({ playlistName: 'Unauthorised' });
      expect(res.status).to.equal(401);
    });

  });

  describe('GET /api/playlists', () => {

    it('should return all playlists belonging to the logged-in user', async () => {
      await request(app).post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`).send({ playlistName: 'Playlist A' });
      await request(app).post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`).send({ playlistName: 'Playlist B' });

      const res = await request(app)
        .get('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array').with.lengthOf(2);
    });

  });

  describe('PUT /api/playlists/:id', () => {

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'Old Name' });
      playlistId = res.body._id;
    });

    it('should rename a playlist', async () => {
      const res = await request(app)
        .put(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'New Name' });
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('playlistName', 'New Name');
    });

  });

  describe('DELETE /api/playlists/:id', () => {

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'To Delete' });
      playlistId = res.body._id;
    });

    it('should delete a playlist', async () => {
      const res = await request(app)
        .delete(`/api/playlists/${playlistId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('message', 'Playlist deleted');
    });

    it('should return 404 when playlist does not exist', async () => {
      const fakeId = '64f1a2b3c4d5e6f7a8b9c0d1';
      const res = await request(app)
        .delete(`/api/playlists/${fakeId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).to.equal(404);
    });

  });

  describe('POST /api/playlists/:id/songs', () => {

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ playlistName: 'Song Test Playlist' });
      playlistId = res.body._id;
    });

    it('should return 400 when songId is missing', async () => {
      const res = await request(app)
        .post(`/api/playlists/${playlistId}/songs`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'songId required');
    });

  });

});