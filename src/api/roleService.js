import api from "./axios";

export const getRoles = async () => {
  const response = await api.get("/Role");
  return response.data;
};