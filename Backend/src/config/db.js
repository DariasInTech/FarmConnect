import  {MongoClient} from "mongodb";

const client = new MongoClient("mongodb://127.0.0.1:27017");
async function connectDB(){
    try{
        await client.connect();
        console.log("MongoDB connected Successfully");
        const db = client.db("farmconnect");
        return db;
    }catch (error){
        console.log("Database connection failed:", error.message);
        throw error;
    }
    
}
export default connectDB;