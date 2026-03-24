import api from "./axios";

export const getProfessors = async () => {
  const response = await api.get("/Professor");
  return response.data;
};

export const createProfessor = async (data) => {
  const response = await api.post("/Professor", data);
  return response.data;
};

export const deleteProfessor = async (id) => {
  await api.delete(`/Professor/${id}`);
};