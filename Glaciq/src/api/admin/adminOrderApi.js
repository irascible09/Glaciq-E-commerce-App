import axiosAdmin from "./axiosAdmin";

export const fetchAllOrders = () =>
    axiosAdmin.get("/orders");

export const updateOrderStatus = (orderId, status) =>
    axiosAdmin.patch(`/orders/${orderId}/status`, {
        status,
    });

export const assignDeliveryPartner = (orderId, partnerId) =>
    axiosAdmin.patch(`/orders/${orderId}/assign-partner`, {
        partnerId,
    });
