import mongoose from "mongoose";

// create mongoDB Connection

const mongoDbConnect = async() =>{
try {
    const connection = await mongoose.connect(process.env.MONGO_STRING)
    console.log(`mongodb connected successfully`);
    
} catch (error) {
    console.log(`${error.message}`);
}
}
export default mongoDbConnect