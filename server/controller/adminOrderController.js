const Order = require("../model/orderModel");
const Product = require("../model/productmodel");
const InventoryLog = require("../model/InventoryLog");

// ADMIN: get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error("Admin get orders error:", error);
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

// ADMIN: update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        console.log("Order items for delivery:", JSON.stringify(order.items));

        // 🚫 prevent double delivery
        if (order.orderStatus === "DELIVERED") {
            console.error("Error: Order already delivered");
            return res.status(400).json({
                message: "Order already delivered",
            });
        }

        // ✅ INVENTORY DEDUCTION HAPPENS ONLY HERE
        if (status === "DELIVERED") {
            for (const item of order.items) {
                // Safely handle missing product reference (e.g., from old/test orders)
                if (!item.product) {
                    console.warn(`Skipping stock deduction for item "${item.name}" (no product ID)`);
                    continue;
                }

                const product = await Product.findById(item.product);

                if (!product) {
                    console.error("Error: Product not found for order item", item.product);
                    // Instead of failing, log error and continue (or return 400 if strict)
                    // For now, let's allow delivery to proceed but skip this item's stock
                    console.warn(`Product ${item.product} not found in DB, skipping deduction`);
                    continue;
                }

                const beforeState = {
                    packQuantity: product.stock.packQuantity,
                    looseQuantity: product.stock.looseQuantity,
                };

                let bottlesToDeduct = item.quantity * product.packSize;

                // consume loose bottles first
                if (product.stock.looseQuantity >= bottlesToDeduct) {
                    product.stock.looseQuantity -= bottlesToDeduct;
                } else {
                    bottlesToDeduct -= product.stock.looseQuantity;
                    product.stock.looseQuantity = 0;

                    const packsUsed = Math.ceil(
                        bottlesToDeduct / product.packSize
                    );

                    product.stock.packQuantity -= packsUsed;

                    const excess =
                        packsUsed * product.packSize - bottlesToDeduct;

                    product.stock.looseQuantity += excess;
                }

                await product.save();

                // 🧾 INVENTORY AUDIT LOG
                await InventoryLog.create({
                    product: product._id,
                    action: "ORDER_DELIVERED",
                    changeInBottles: -(item.quantity * product.packSize),
                    before: beforeState,
                    after: {
                        packQuantity: product.stock.packQuantity,
                        looseQuantity: product.stock.looseQuantity,
                    },
                    performedBy: "SYSTEM",
                    reason: `Order ${order.orderNumber} delivered`,
                });
            }

            order.deliveredAt = new Date();
        }

        order.orderStatus = status;
        await order.save();

        res.json({
            success: true,
            message: "Order status updated",
            order,
        });
    } catch (error) {
        console.error("Admin order update error:", error);
        res.status(500).json({
            message: "Failed to update order",
        });
    }
};

// ADMIN: assign delivery partner
exports.assignDeliveryPartner = async (req, res) => {
    try {
        const { partnerId } = req.body;
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.deliveryPartner = partnerId;
        // order.orderStatus = "PREPARING"; // Removed as per simplified flow: Assing Partner -> Manually Mark Out For Delivery
        await order.save();

        res.json({ message: "Delivery partner assigned", order });
    } catch (error) {
        console.error("Assign Partner Error:", error);
        res.status(500).json({ message: "Failed to assign partner" });
    }
};
