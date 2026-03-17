const Playlist = require('../models/Playlist');

const getPlaylistById = async (id, userId) => {
  const playlist = await Playlist.findOne({ _id: id, userId }).populate({
    path: 'songs',
    populate: [
      { path: 'albumId' },
      { path: 'artistId' },
      { path: 'directorId' }
    ]
  });
  if (!playlist) throw new Error('Playlist not found');
  return playlist;
};

const getUserPlaylists = async (userId) => {
  return await Playlist.find({ userId }).populate({
    path: 'songs',
    populate: [
      { path: 'albumId' },
      { path: 'artistId' },
      { path: 'directorId' }
    ]
  });
};

const createPlaylist = async (userId, data) => {
  return await Playlist.create({ ...data, userId });
};

const updatePlaylist = async (id, userId, data) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, userId }, data, { returnDocument: 'after' }
  );
  if (!playlist) throw new Error('Playlist not found');
  return playlist;
};

const deletePlaylist = async (id, userId) => {
  const playlist = await Playlist.findOneAndDelete({ _id: id, userId });
  if (!playlist) throw new Error('Playlist not found');
  return playlist;
};

const addSongToPlaylist = async (id, userId, songId) => {
  if (!songId) throw new Error('songId required');
  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, userId },
    { $addToSet: { songs: songId } },
    { returnDocument: 'after' }
  );
  if (!playlist) throw new Error('Playlist not found');
  return playlist;
};

const removeSongFromPlaylist = async (id, userId, songId) => {
  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, userId },
    { $pull: { songs: songId } },
    { returnDocument: 'after' }
  );
  if (!playlist) throw new Error('Playlist not found');
  return playlist;
};

module.exports = {
  getUserPlaylists, getPlaylistById, createPlaylist, updatePlaylist,
  deletePlaylist, addSongToPlaylist, removeSongFromPlaylist
};
