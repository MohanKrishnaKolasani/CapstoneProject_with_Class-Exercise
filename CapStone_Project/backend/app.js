const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/songs',         require('./routes/songs'));
app.use('/api/playlists',     require('./routes/playlists'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/artists',       require('./routes/artists'));
app.use('/api/directors',     require('./routes/directors'));
app.use('/api/albums',        require('./routes/albums'));

module.exports = app;