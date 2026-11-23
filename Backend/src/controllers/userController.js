import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {createUserModel} from "../models/users.js";
function createUserController(db){
    const user = createUserModel(db);

    //creating a new user
    async function registerUser(req, res){
        try{
            const {name, email, password,role, phone, region, town}=req.body;
            //check required fields
            if(!name || !email || !password){
                return res.status(400).json({message: "Name, email and password are required"});
                //check if email already exists
            }
            const existingUser = await user.findByEmail(email);
                if(existingUser){
                    return res.status(409).json({message: "Email already registered"});
                }
                // password hashing
                const passwordHash = await bcrypt.hash(password,10);
                const newUser = await user.create({
                    name,
                    email: email.toLowerCase().trim(),
                    passwordHash,
                    role:["Farmer","buyer"].includes(role) ? role : "buyer",
                    phone,
                    region,
                    town,
                    createdAt: new Date()
                });
                res.status(201).json({message:"User registered successfully",
                    user:{
                        id:newUser._id,
                        name:newUser.name,
                        email:newUser.email,
                        role:newUser.role
                    }
});
        }catch(error){
            res.status(500).json({message: "Registeration Failed",error:error.message});
        }
    }
    //login user
    async function loginUser(req, res){
        try{
            const {email, password} = req.body;
            if(!email || !password){
                return res.status(400).json({message:"Email and password are required"});
            }
            const foundUser = await user.findByEmail(email.trim());
            if(!foundUser){
                return res.status(401).json({message:"Invalid email or password"});
            }
            const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
            if(!isMatch){
                return res.status(401).json({message:"Invalid email or password"});
            }
            const token = jwt.sign({userId:foundUser._id.toString(), role:foundUser.role},process.env.JWT_SECRET,{expiresIn:"1d"});
            res.status(200).json({message:"Login successful", token, user:{
                id:foundUser._id,
                name:foundUser.name,
                email:foundUser.email,
                role:foundUser.role
            }});
        }catch(error){
            res.status(500).json({message:"Login failed", error:error.message});
        }
    }
    async function getUserProfile(req, res){
        try{
            const userId = req.user.userId;
            const foundUser = await user.findById(userId);
            if(!foundUser){
                return res.status(404).json({message:"User not found"});
            }
            res.status(200).json({message:"Profile retrieved successfully",foundUser});
        }catch(error){
            res.status(500).json({message:"Failed to retrieve profile", error:error.message})
        }
    }
    async function updateUserProfile(req, res){
        try{
            const userId = req.user.userId;
            const {name, phone, region, town} = req.body;
            const updateData = {};
            if(name !== undefined) updateData.name = name;
            if(phone !== undefined) updateData.phone = phone;
            if(region !== undefined) updateData.region = region;
            if(town !== undefined) updateData.town = town;
           // const updatedUser = await user.updateById(userId, updateData);
            if(Object.keys(updateData).length === 0){
                return res.status(400).json({message:"No valid field provided for update"});
            }
            const result = await user.update(userId, updateData); 
            if(!result || result.matchedCount ===0){
                return res.status(404).json({message:"User not found"});
            } 
            res.status(200).json({message:"Profile updated successfully"}); 
        }catch(error){
            res.status(500).json({message:"Failed to update profile", error:error.message});
        }
    }
    async function deleteUserAccount(req,res){
        try{
            const userId = req.user.userId;
            const result = await user.delete(userId);
            if(!result || result.deletedCount ===0){
                return res.status(404).json({message:"User not found"});
            }
            res.status(200).json({message:"Account Deleted"})
        }catch(error){
            res.status(500).json({message:"Failed to delete account", error:error.message});
        }
    }

    return{
        registerUser,
        loginUser,
        getUserProfile,
        updateUserProfile,
        deleteUserAccount
    }
}
export{createUserController};