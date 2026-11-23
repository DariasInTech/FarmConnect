import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js"
function createReviewRoutes(reviewController){
    const router = express.Router();
    //creating a review
    router.post("/",authMiddleware,reviewController.createReview);
    //get product review
    router.get("/product/:productId",reviewController.getProductReviews);
    //get farmers review 
    router.get("/farmer/farmerId",reviewController.getFarmerReviews)
    //update a review
    router.put("/:id", authMiddleware,reviewController.updateReview);
    //delete review
    router.delete("/id",authMiddleware,reviewController.deleteReview)
    return router;
}
export{createReviewRoutes};