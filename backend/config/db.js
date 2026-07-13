//backend/config/db.js

import mongoose from "mongoose" 

const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to mongoDB")
    }
    catch(error){
        console.error("error connecting to mongoDB:", error.message)
        process.exit(1)
    }
}

export default connectDB