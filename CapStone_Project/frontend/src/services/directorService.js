import API from "../api/axiosConfig";

export const getDirectors = () => API.get("/directors");

export const addDirector = (data) =>
  API.post("/directors", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const updateDirector = (id, data) =>
  API.put(`/directors/${id}`, data);

export const updateDirectorPhoto = (id, data) =>
  API.patch(`/directors/${id}/photo`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const deleteDirector = (id) =>
  API.delete(`/directors/${id}`);