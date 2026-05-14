import mongoose from "mongoose";

const connecDb = async()=>{
try{
    mongoose.connection.on("connected",()=>{console.log("DB Connected!!");
    })
      await mongoose.connect(process.env.MONGODB_URI)
}
catch(err){
    console.log("Database connection Failed:", err.message);
    
}
}
export default connecDb