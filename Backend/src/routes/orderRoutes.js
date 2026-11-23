import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

function createOrderRoutes(orderController) {
    const router = express.Router();

    router.post("/", authMiddleware, orderController.placeOrder);

    router.get("/buyer", authMiddleware, orderController.getBuyerOrders);

    router.get("/farmer", authMiddleware, orderController.getFarmerOrders);

    router.put("/:id/cancel", authMiddleware, orderController.cancelOrder);

    router.put("/:id/accept", authMiddleware, orderController.acceptOrder);

    router.put("/:id/reject", authMiddleware, orderController.rejectOrder);

    router.put("/:id/complete", authMiddleware, orderController.completeOrder);

    return router;
}

export { createOrderRoutes };