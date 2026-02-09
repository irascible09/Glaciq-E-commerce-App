import axiosAdmin from "./axiosAdmin";

// Partners
export const fetchPartners = () => axiosAdmin.get("/partners");
export const addPartner = (data) => axiosAdmin.post("/partners", data);
export const updatePartnerStatus = (id, status) =>
    axiosAdmin.patch(`/partners/${id}`, { status });

// Settings
export const fetchSettings = () => axiosAdmin.get("/settings");
export const updateSettings = (data) => axiosAdmin.put("/settings", data);
