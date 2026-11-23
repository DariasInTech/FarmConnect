import express from "express";
import {authMiddleware} from "../middleware/authMiddleware.js";;
function createUserRoutes(userController){
    const router = express.Router();
    //register user
    router.post("/register",userController.registerUser);

//login user
router.post("/login",userController.loginUser);

//view user profile
router.get("/profile/:id",authMiddleware,userController.getUserProfile);
//update user profile
router.put("/profile/:id",authMiddleware,userController.updateUserProfile);
//delete user profile
router.delete("/profile",authMiddleware,userController.deleteUserAccount);
return router;

}
export {createUserRoutes};