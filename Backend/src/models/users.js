import {ObjectId} from "mongodb";
function createUserModel(db){
    const users = db.collection("users");
    return {
        //creating a new user
        async create(userData){
            const result = await users.insertOne(userData);
            return{
            ...userData, _id: result.insertedId};  
        },
        //finding a new user by email
        async findByEmail(email){
            return await users.findOne({email:email.toLowerCase()});
        },
        //find a user by id
        async findById(id){
            if(!ObjectId.isValid(id)){
                return null;
            }
            return await users.findOne({_id: new ObjectId(id)},{projection:{passwordHash:0}});
        },
        //updating a user by id
        async update(id, updateData){
            if(!ObjectId.isValid(id)){
                return null;
            }
            const result = await users.updateOne({_id : new ObjectId(id)}, {$set: updateData});
            return result;
        },
        //deleting a user by id
        async delete(id){
            if(!ObjectId.isValid(id)){
                return null;
            }
            return await users.deleteOne({_id: new ObjectId(id)});
        }

    }
}
export {createUserModel};
