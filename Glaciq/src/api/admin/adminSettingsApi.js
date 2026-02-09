import axiosAdmin from "./axiosAdmin";

export const fetchSettings = () =>
    axiosAdmin.get('/settings');

export const updateSettings = (data) =>
    axiosAdmin.put('/settings', data);
