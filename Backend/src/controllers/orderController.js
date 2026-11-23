
import { ObjectId } from "mongodb";
import { createOrderModel } from "../models/orders.js";

function createOrderController(db) {
    const order = createOrderModel(db);

    return {
        // Place an order
        async placeOrder(req, res) {
            try {
                const { farmerId, items } = req.body;
                const buyerId = req.user.userId;

                if (
                    !ObjectId.isValid(farmerId) ||
                    !Array.isArray(items) ||
                    items.length === 0
                ) {
                    return res.status(400).json({
                        message: "Valid Farmer ID and order items are required"
                    });
                }

                const totalAmount = items.reduce((total, item) => {
                    return total + Number(item.price || 0) * Number(item.quantity || 0);
                }, 0);

                const orderData = {
                    buyerId: new ObjectId(buyerId),
                    farmerId: new ObjectId(farmerId),
                    items,
                    totalAmount,
                    deliveryAddress: req.body.deliveryAddress || "",
                    phone: req.body.phone || "",
                    status: "Pending",
                    createdAt: new Date()
                };

                const newOrder = await order.create(orderData);

                return res.status(201).json({
                    message: "Order placed successfully",
                    order: newOrder
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to place order",
                    error: error.message
                });
            }
        },

        // Cancel an order
        async cancelOrder(req, res) {
            try {
                const { id } = req.params;
                const buyerId = req.user.userId;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid order ID"
                    });
                }

                const foundOrder = await order.findById(id);

                if (!foundOrder) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                if (foundOrder.buyerId.toString() !== buyerId) {
                    return res.status(403).json({
                        message: "You cannot cancel another buyer's order"
                    });
                }

                if (foundOrder.status !== "Pending") {
                    return res.status(400).json({
                        message: "Only pending orders can be cancelled"
                    });
                }

                await order.update(id, {
                    status: "Cancelled",
                    cancelledAt: new Date()
                });

                return res.status(200).json({
                    message: "Order cancelled successfully"
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to cancel order",
                    error: error.message
                });
            }
        },

        // Get buyer orders
        async getBuyerOrders(req, res) {
            try {
                const buyerId = req.user.userId;
                const orders = await order.findByBuyerId(buyerId);

                return res.status(200).json({
                    message: "Orders successfully retrieved",
                    orders
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to retrieve orders",
                    error: error.message
                });
            }
        },

        // Get farmer orders
        async getFarmerOrders(req, res) {
            try {
                const farmerId = req.user.userId;
                const orders = await order.findByFarmerId(farmerId);

                return res.status(200).json({
                    message: "Orders successfully retrieved",
                    orders
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to retrieve orders",
                    error: error.message
                });
            }
        },

        // Accept an order
        async acceptOrder(req, res) {
            try {
                const { id } = req.params;
                const farmerId = req.user.userId;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid order ID"
                    });
                }

                const foundOrder = await order.findById(id);

                if (!foundOrder) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                if (foundOrder.farmerId.toString() !== farmerId) {
                    return res.status(403).json({
                        message: "You cannot manage another farmer's order"
                    });
                }

                if (foundOrder.status !== "Pending") {
                    return res.status(400).json({
                        message: "Only pending orders can be accepted"
                    });
                }

                await order.update(id, {
                    status: "Accepted"
                });

                return res.status(200).json({
                    message: "Order accepted successfully"
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to accept order",
                    error: error.message
                });
            }
        },

        // Reject an order
        async rejectOrder(req, res) {
            try {
                const { id } = req.params;
                const farmerId = req.user.userId;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid order ID"
                    });
                }

                const foundOrder = await order.findById(id);

                if (!foundOrder) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                if (foundOrder.farmerId.toString() !== farmerId) {
                    return res.status(403).json({
                        message: "You cannot manage another farmer's order"
                    });
                }

                if (foundOrder.status !== "Pending") {
                    return res.status(400).json({
                        message: "Only pending orders can be rejected"
                    });
                }

                await order.update(id, {
                    status: "Rejected"
                });

                return res.status(200).json({
                    message: "Order rejected successfully"
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to reject order",
                    error: error.message
                });
            }
        },

        // Complete an order
        async completeOrder(req, res) {
            try {
                const { id } = req.params;
                const farmerId = req.user.userId;

                if (!ObjectId.isValid(id)) {
                    return res.status(400).json({
                        message: "Invalid order ID"
                    });
                }

                const foundOrder = await order.findById(id);

                if (!foundOrder) {
                    return res.status(404).json({
                        message: "Order not found"
                    });
                }

                if (foundOrder.farmerId.toString() !== farmerId) {
                    return res.status(403).json({
                        message: "You cannot manage another farmer's order"
                    });
                }

                if (foundOrder.status !== "Accepted") {
                    return res.status(400).json({
                        message: "Only accepted orders can be completed"
                    });
                }

                await order.update(id, {
                    status: "Completed",
                    completedAt: new Date()
                });

                return res.status(200).json({
                    message: "Order completed successfully"
                });

            } catch (error) {
                return res.status(500).json({
                    message: "Failed to complete order",
                    error: error.message
                });
            }
        }
    };
}

export { createOrderController };
