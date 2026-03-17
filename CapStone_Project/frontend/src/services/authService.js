import API from "../api/axiosConfig";

export const registerUser = (data) => {
  return API.post("/auth/register", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const getProfile = () => {
  return API.get("/auth/profile");
};

export const uploadProfilePicture = (formData) => {
  return API.post("/auth/profile-picture", formData);
};