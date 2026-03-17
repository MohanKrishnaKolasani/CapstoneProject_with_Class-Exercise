import API from "../api/axiosConfig";

export const getArtists = () => API.get("/artists");

export const addArtist = (data) =>
  API.post("/artists", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateArtist = (id, data) =>
  API.put(`/artists/${id}`, data);

export const updateArtistPhoto = (id, data) =>
  API.patch(`/artists/${id}/photo`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteArtist = (id) =>
  API.delete(`/artists/${id}`);