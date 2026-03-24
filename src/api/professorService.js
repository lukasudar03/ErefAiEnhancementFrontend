import api from "./axios";

export const createProfessor = async (data) => {
  const response = await api.post("/Professor", data);
  return response.data;
};