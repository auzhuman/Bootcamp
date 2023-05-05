const mongoose = require("mongoose")
const connectdb = async()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongodb connected :${conn.connection.host}`);
}
module.exports = connectdb;
 