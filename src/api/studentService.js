import api from "./axios";

export const getStudents = async () => {
  const response = await api.get("/Student");
  return response.data;
};

export const createStudent = async (data) => {
  const response = await api.post("/Student", data);
  return response.data;
};

export const deleteStudent = async (id) => {
  await api.delete(`/Student/${id}`);
};