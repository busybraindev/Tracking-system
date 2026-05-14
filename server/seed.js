import "dotenv/config"
import connecDb from "./config/db.js"
import User from "./models/User.js";
import bcrypt from "bcrypt"

const TemporaryPassword="12345678"
 async function registerAdmin() {
    try{
   const ADMIN_EMAIL=process.env.ADMIN_EMAIL
   if(!ADMIN_EMAIL){
    console.log("Missing ADMIN_EMAIL env variables");
    process.exit(1)
    
   }
   await connecDb()
   const existingAdmin =await User.findOne({email:process.env.ADMIN_EMAIL})
   if(existingAdmin){
    console.log("User already exists as role", existingAdmin.role);
    process.exit(0)
    
   }
   const hp =await bcrypt.hash(TemporaryPassword,10)
   const admin=await User.create({
    email:process.env.ADMIN_EMAIL,
    password:hp,
    role:"ADMIN"
   })
   console.log("Admin user created");
   console.log("\nemail:", admin.email);
   console.log("Password", TemporaryPassword);
   console.log("\nchange the password after login");
   process.exit(0)
   
    }
    catch(err){
  console.error("Seed failed", err);
  
    }
    
 }
 registerAdmin()