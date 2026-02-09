import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from "../../utils/config";

const axiosAdmin = axios.create({
    baseURL: `${API_BASE_URL}/admin`,
    headers: {
        "Content-Type": "application/json"
    }
});


axiosAdmin.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosAdmin;
