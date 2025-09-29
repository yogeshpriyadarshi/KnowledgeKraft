const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const connectMongoDB = async()=>{
    try{
        const connected = await mongoose.connect(MONGO_URI);
    }catch(err){
        console.log(err);
    }
}

module.exports = {connectMongoDB}