import API from "../api/axiosConfig";

export const getUsers   = ()         => API.get("/auth/users");
export const updateUser = (id, data) => API.put(`/auth/users/${id}`, data);
export const deleteUser = (id)       => API.delete(`/auth/users/${id}`);