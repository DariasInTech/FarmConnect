import{ObjectId} from "mongodb";
function createOrderModel(db){
    const orders = db.collection("orders")
    return{
        //create an order
        async create(orderData){
            const result = await orders.insertOne(orderData);
            return {
                ...orderData,_id:result.insertedId
            };
        },
        //find order by buyer
        async findByBuyerId(buyerId){
            return await orders.find({
                buyerId: new ObjectId(buyerId)
            }).toArray(); 
        },
        // Find order by ID
        async findById(id) {
        if (!ObjectId.isValid(id)) return null;

             return await orders.findOne({
        _id: new ObjectId(id)
    });
},
        //find order by farmer
        async findByFarmerId(farmerId){
            return await orders.find({farmerId: new ObjectId(farmerId)}).toArray();
        },
        //update order
        async update(id, updateData){
            if(!ObjectId.isValid(id))
     return null;
    return await orders.updateOne({_id: new ObjectId(id)}, {$set:updateData})

        }
    }
}
export{createOrderModel};