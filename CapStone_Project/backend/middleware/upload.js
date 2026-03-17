const multer = require('multer');
const path = require('path');

const createStorage = (folder, nameFn) => multer.diskStorage({
  destination: (req, file, cb) => cb(null, `uploads/${folder}`),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${nameFn(req)}_${Date.now()}${ext}`);
  }
});

const profileStorage  = createStorage('profiles',  () => 'profile');
const songStorage     = createStorage('songs',     (req) => req.body.songName     ? req.body.songName.trim().replace(/\s+/g, '_')     : `song_${Date.now()}`);
const artistStorage   = createStorage('artists',   (req) => req.body.artistName   ? req.body.artistName.trim().replace(/\s+/g, '_')   : 'artist');
const directorStorage = createStorage('directors', (req) => req.body.directorName ? req.body.directorName.trim().replace(/\s+/g, '_') : 'director');
const albumStorage    = createStorage('albums',    (req) => req.body.albumName    ? req.body.albumName.trim().replace(/\s+/g, '_')    : 'album');

exports.uploadProfile  = multer({ storage: profileStorage });
exports.uploadSong     = multer({ storage: songStorage });
exports.uploadArtist   = multer({ storage: artistStorage });
exports.uploadDirector = multer({ storage: directorStorage });
exports.uploadAlbum    = multer({ storage: albumStorage });