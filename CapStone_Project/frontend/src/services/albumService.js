import API from "../api/axiosConfig";

export const getAlbums    = ()         => API.get("/albums");
export const addAlbum     = (formData) => API.post("/albums", formData);
export const updateAlbum  = (id, fd)   => API.put(`/albums/${id}`, fd);
export const deleteAlbum  = (id)       => API.delete(`/albums/${id}`);
export const getDirectors = ()         => API.get("/directors");