import axiosAdmin from "./axiosAdmin";

export const fetchInventory = () =>
    axiosAdmin.get("/products");

export const addStock = (productId, addedBottles) =>
    axiosAdmin.patch(`/products/${productId}/add-stock`, {
        addedBottles,
    });

export const reduceStock = (productId, reduceBottles) =>
    axiosAdmin.patch(`/products/${productId}/reduce-stock`, {
        reduceBottles,
    });

export const updateDiscount = (productId, discount) =>
    axiosAdmin.patch(`/products/${productId}/discount`, {
        discount,
    });

export const toggleStatus = (productId) =>
    axiosAdmin.patch(`/products/${productId}/status`);

export const updatePrice = (productId, price) =>
    axiosAdmin.patch(`/products/${productId}/price`, { price });

export const createProduct = (productData) =>
    axiosAdmin.post("/products", productData);

export const toggleBestSeller = (productId) =>
    axiosAdmin.patch(`/products/${productId}/best-seller`);
