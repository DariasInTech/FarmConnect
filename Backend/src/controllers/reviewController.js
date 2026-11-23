import { ObjectId } from "mongodb";
import { createReviewModel } from "../models/Review.js";
import { createOrderModel } from "../models/orders.js";

function createReviewController(db) {
    const review = createReviewModel(db);
    const order = createOrderModel(db);

    return {
        // Create a review
        async createReview(req, res) {
            try {
                const { orderId, productId, rating, comment } = req.body;
                const buyerId = req.user.userId;

                if (!ObjectId.isValid(orderId) || !ObjectId.isValid(productId)) {
                    return res.status(400).json({ message: "Invalid order or product ID" });
                }

                if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
                    return res.status(400).json({ message: "Rating must be between 1 and 5" });
                }

                const foundOrder = await order.findById(orderId);

                if (!foundOrder) {
                    return res.status(404).json({ message: "Order not found" });
                }

                if (foundOrder.buyerId.toString() !== buyerId) {
                    return res.status(403).json({ message: "You cannot review this order" });
                }

                if (foundOrder.status !== "Completed") {
                    return res.status(400).json({ message: "You can only review completed orders" });
                }

                const productExists = foundOrder.items.some(
                    item => item.productId.toString() === productId
                );

                if (!productExists) {
                    return res.status(400).json({ message: "Product is not in this order" });
                }

                const existingReview = await review.findByOrderAndProduct(orderId, productId);

                if (existingReview) {
                    return res.status(409).json({ message: "You have already reviewed this product" });
                }

                const reviewData = {
                    orderId: new ObjectId(orderId),
                    productId: new ObjectId(productId),
                    buyerId: new ObjectId(buyerId),
                    farmerId: foundOrder.farmerId,
                    rating,
                    comment: comment || "",
                    createdAt: new Date(),
                    updatedAt: new Date()
                };

                const newReview = await review.create(reviewData);

                return res.status(201).json({
                    message: "Review created successfully",
                    review: newReview
                });

            } catch (error) {
                return res.status(500).json({ message: "Failed to create review", error: error.message });
            }
        },

        // Get reviews for a product
        async getProductReviews(req, res) {
            try {
                const reviews = await review.findByProductId(req.params.productId);
                return res.status(200).json({ reviews });
            } catch (error) {
                return res.status(500).json({ message: "Failed to retrieve reviews" });
            }
        },

        // Get reviews for a farmer
        async getFarmerReviews(req, res) {
            try {
                const reviews = await review.findByFarmerId(req.params.farmerId);
                return res.status(200).json({ reviews });
            } catch (error) {
                return res.status(500).json({ message: "Failed to retrieve reviews" });
            }
        },

        // Update a review
        async updateReview(req, res) {
            try {
                const { id } = req.params;
                const buyerId = req.user.userId;
                const { rating, comment } = req.body;

                const foundReview = await review.findById(id);

                if (!foundReview) {
                    return res.status(404).json({ message: "Review not found" });
                }

                if (foundReview.buyerId.toString() !== buyerId) {
                    return res.status(403).json({ message: "You cannot update this review" });
                }

                if (rating !== undefined &&
                    (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
                    return res.status(400).json({ message: "Rating must be between 1 and 5" });
                }

                await review.update(id, {
                    ...(rating !== undefined && { rating }),
                    ...(comment !== undefined && { comment }),
                    updatedAt: new Date()
                });

                return res.status(200).json({ message: "Review updated successfully" });

            } catch (error) {
                return res.status(500).json({ message: "Failed to update review", error: error.message });
            }
        },

        // Delete a review
        async deleteReview(req, res) {
            try {
                const { id } = req.params;
                const buyerId = req.user.userId;

                const foundReview = await review.findById(id);

                if (!foundReview) {
                    return res.status(404).json({ message: "Review not found" });
                }

                if (foundReview.buyerId.toString() !== buyerId) {
                    return res.status(403).json({ message: "You cannot delete this review" });
                }

                await review.delete(id);

                return res.status(200).json({ message: "Review deleted successfully" });

            } catch (error) {
                return res.status(500).json({ message: "Failed to delete review", error: error.message });
            }
        }
    };
}

export { createReviewController };
