const mongoose = require('mongoose');
const app      = require('./app');
const fs       = require('fs');
const path     = require('path');
require('dotenv').config();

const uploadDirs = [
  'uploads',
  'uploads/songs',
  'uploads/albums',
  'uploads/artists',
  'uploads/directors',
  'uploads/profiles',
];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created folder: ${dir}`);
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));