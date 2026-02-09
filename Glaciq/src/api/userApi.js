import api from '../utils/api'

export const fetchStoreConfig = async () => {
    try {
        const { data } = await api.get('/auth/config');
        return data.success ? data.config : null;
    } catch (error) {
        console.error("Config fetch error:", error);
        return null;
    }
}

export const fetchProducts = async () => {
    try {
        const { data } = await api.get('/auth/products');
        return data.success ? data.products : [];
    } catch (error) {
        console.error("Products fetch error:", error);
        return [];
    }
}
