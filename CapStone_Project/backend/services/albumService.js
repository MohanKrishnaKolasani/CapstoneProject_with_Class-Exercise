const Album = require('../models/Album');
const fs    = require('fs');

const normalisePath = (p) => p ? p.replace(/\\/g, '/') : p;

const getAllAlbums = async () => await Album.find().populate('directorId');

const addAlbum = async (data, coverImagePath) => {
  return await Album.create({
    albumName:   data.albumName,
    releaseDate: data.releaseDate || null,
    directorId:  data.directorId  || null,
    coverImage:  coverImagePath ? normalisePath(coverImagePath) : null,
  });
};

const updateAlbum = async (id, data, coverImagePath) => {
  const album = await Album.findById(id);
  if (!album) throw new Error('Album not found');

  if (data.albumName)              album.albumName   = data.albumName;
  if (data.releaseDate !== undefined) album.releaseDate = data.releaseDate || null;
  if (data.directorId  !== undefined) album.directorId  = data.directorId  || null;

  if (coverImagePath) {
    if (album.coverImage && fs.existsSync(album.coverImage)) fs.unlinkSync(album.coverImage);
    album.coverImage = normalisePath(coverImagePath);
  }

  await album.save();
  return await Album.findById(id).populate('directorId');
};

const deleteAlbum = async (id) => {
  const album = await Album.findByIdAndDelete(id);
  if (!album) throw new Error('Album not found');
  if (album.coverImage && fs.existsSync(album.coverImage)) fs.unlinkSync(album.coverImage);
  return album;
};

module.exports = { getAllAlbums, addAlbum, updateAlbum, deleteAlbum };