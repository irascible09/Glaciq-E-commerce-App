import axiosAdmin from "./axiosAdmin";

export const fetchAdmins = () => axiosAdmin.get("/");
export const createAdmin = (data) => axiosAdmin.post("/create", data);
export const deleteAdmin = (id) => axiosAdmin.delete(`/${id}`);
