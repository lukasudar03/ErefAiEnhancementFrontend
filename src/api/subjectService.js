import api from "./axios";

export const getSubjects = async () => {
  const response = await api.get("/Subject");
  return response.data;
};

export const createSubject = async (data) => {
  const response = await api.post("/Subject", data);
  return response.data;
};

export const deleteSubject = async (id) => {
  await api.delete(`/Subject/${id}`);
};