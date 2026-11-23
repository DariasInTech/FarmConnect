import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import {ObjectId} from "mongodb";
import { authMiddleware } from "./src/middleware/authMiddleware.js";
import dotenv from "dotenv";
import { createUserController} from "./src/controllers/userController.js";
import { createUserRoutes } from "./src/routes/userRoutes.js";
import { createOrderController } from "./src/controllers/orderController.js";
import { createOrderRoutes } from "./src/routes/orderRoutes.js";
import { createReviewController } from "./src/controllers/reviewController.js";
import { createReviewRoutes } from "./src/routes/reviewRoutes.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
let db;
async function startServer(){
    try{
        db = await connectDB();
        //initialize user controller
        const userController = createUserController(db);
        //initializing user routes
        const userRoutes = createUserRoutes(userController);
        //initialising order controller
        const orderController = createOrderController(db);
        //initialising order routes
        const orderRoutes = createOrderRoutes(orderController);
         //initialising review controller
         const reviewController = createReviewController(db);
         //initialising review routes
        const reviewRoutes = createReviewRoutes(reviewController);

        //mounting review routes
        app.use("/api/reviews",reviewRoutes);
        //mounting order routes
        app.use("/api/orders", orderRoutes);
        //mounting user routes
        app.use("/api/users",userRoutes);
        app.get("/", (req, res) => {
    res.send("Welcome to FarmConnect!")
});
//get all products
    app.get("/api/products", async (req, res) => {
        try{
            const products = await db.collection("products").find().toArray();
            res.status(200).json(products);
        }catch (error){
            res.status(500).json({message: "Failed to fetch products",error: error.message})
        }
    });


// Get products belonging to the logged-in farmer
app.get("/api/products/my-products", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "Farmer") {
            return res.status(403).json({
                message: "Only farmers can view their products"
            });
        }

        const products = await db.collection("products")
            .find({
                farmerId: new ObjectId(req.user.userId)
            })
            .toArray();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch farmer products",
            error: error.message
        });
    }
});


    //adding a new product using the POST method
app.post("/api/products", authMiddleware,async (req, res) =>{
    try{
        if (req.user.role !== "Farmer") {
    return res.status(403).json({ message: "Only farmers can add products" });}
        const{
            name,category, description, price, unit, quantityAvailable, region, town} = req.body;
            if(!name || !category || !price || !quantityAvailable){
                return res.status(400).json({message: "Please provide all required product details"}); 
        }
        const newProduct = {
            farmerId: new ObjectId(req.user.userId),
            name,
            category,
            description,
            image: req.body.image || "",
            price: Number(price),
            unit,
            quantityAvailable: Number(quantityAvailable),
            location: { region, town },
            availability: "Available",
            createdAt: new Date() 
        };
        const result = await db.collection("products").insertOne(newProduct);
        res.status(201).json({message: "Product sucessfully Added",
            productId: result.insertedId
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
});

//Get a product by id
app.get("/api/products/:id", async (req, res) =>{
    try{
    
        const productId = req.params.id;
if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
}

const product = await db.collection("products").findOne({
    _id: new ObjectId(productId)
});
        if(!product){
            return res.status(404).json({message: "product not found"});
        }
        res.status(200).json(product);
    }catch (error){
        res.status(500).json({message: "Failed to fetch product",error: error.message});
    }
});

//Updating a product by id
app.put("/api/products/:id", async (req, res) => {
    try{
        const productId = req.params.id;
        if(!ObjectId.isValid(productId)){
            return res.status(400).json({message:"Invalid product ID"});
        }
        


        const result = await db.collection("products").updateOne({
            _id: new ObjectId(productId)}, {$set: {
           ...req.body, updatedAt: new Date()} 
        });
        if(result.matchedCount === 0){
            return res.status(404).json({message:"product not found"})
        }
        res.status(200).json({message:"product updated successfully"});
    }catch (error){
        res.status(500).json({message:"Failed to update product", error: error.message});
    }
});

//Deleting a product by id
app.delete("/api/products/:id", async (req, res) => {
    try{
        const {ObjectId} = await import("mongodb");
        const productId = req.params.id;
        const deletedProduct = await db.collection("products").deleteOne({ _id: new ObjectId(productId)});
        if(deletedProduct.deletedCount === 0){
            return res.status(404).json({message:"product not found"});
        }
        res.status(200).json({message:"product deleted successfully"});

    }catch (error){
        res.status(500).json({message:"Failed to delete product", error: error.message});
    }

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`FarmConnect server is running on port ${port}`)
});

    }catch(error){
        console.log("Failed to start server:",error.message);
    }
}
startServer();
