import API from "../api/axiosConfig";

export const getSongs        = ()         => API.get("/songs");
export const getAllSongsAdmin = ()         => API.get("/songs/admin/all");
export const getSongById     = (id)       => API.get(`/songs/${id}`);
export const searchSongs     = (params)   => API.get("/songs", { params });
export const addSong         = (data)     => API.post("/songs", data);
export const updateSong      = (id, data) => API.put(`/songs/${id}`, data);
export const deleteSong      = (id)       => API.delete(`/songs/${id}`);
export const toggleVisibility = (id)     => API.patch(`/songs/${id}/visibility`);
