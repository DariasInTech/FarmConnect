import { ObjectId } from "mongodb";

function createReviewModel(db) {
    const reviews = db.collection("reviews");

    return {
        // Create a review
        async create(reviewData) {
            const result = await reviews.insertOne(reviewData);

            return {
                ...reviewData,
                _id: result.insertedId
            };
        },

        // Find review by ID
        async findById(id) {
            if (!ObjectId.isValid(id)) return null;

            return await reviews.findOne({
                _id: new ObjectId(id)
            });
        },

        // Find reviews for a product
        async findByProductId(productId) {
            if (!ObjectId.isValid(productId)) return [];

            return await reviews.find({
                productId: new ObjectId(productId)
            }).sort({ createdAt: -1 }).toArray();
        },

        // Find reviews for a farmer
        async findByFarmerId(farmerId) {
            if (!ObjectId.isValid(farmerId)) return [];

            return await reviews.find({
                farmerId: new ObjectId(farmerId)
            }).sort({ createdAt: -1 }).toArray();
        },

        // Check whether a buyer has reviewed a product in an order
        async findByOrderAndProduct(orderId, productId) {
            return await reviews.findOne({
                orderId: new ObjectId(orderId),
                productId: new ObjectId(productId)
            });
        },

        // Update a review
        async update(id, updateData) {
            if (!ObjectId.isValid(id)) return null;

            return await reviews.updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
        },

        // Delete a review
        async delete(id) {
            if (!ObjectId.isValid(id)) return null;

            return await reviews.deleteOne({
                _id: new ObjectId(id)
            });
        }
    };
}

export { createReviewModel };