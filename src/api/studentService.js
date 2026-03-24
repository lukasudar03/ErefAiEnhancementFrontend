import api from "./axios";

export const createStudent = async (data) => {
  const response = await api.post("/Student", data);
  return response.data;
};