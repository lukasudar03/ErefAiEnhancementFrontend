import api from "./axios";

export const getUsers = async () => {
  const response = await api.get("/User");
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/User", data);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`/User/${id}`);
};