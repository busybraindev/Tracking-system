import Employee from "../models/Em.js"

export const getProfile =async(req,res)=>{
    try{
        const session = req.session
        console.log("SESSION:", req.session);
console.log("USERID:", req.session?.userId);
        const employee = await Employee.findOne({userId:session.userId})
        console.log(employee)
        if(!employee){
            return res.json({firstName: "Admin", lastName:"",email:session.email})
        }
        return res.json(employee)
    }
    catch(err){
        return res.status(500).json({error:"Failed to fetch profile"})
        console.log(err)
    }
}

export const updateprofile = async(req,res)=>{
    try{
        const session = req.session
           const employee = await Employee.findOne({userId:session.userId})
        if(!employee){
            return res.json({error: "Employee not found"})
        }
        if(employee.isDeleted){
            return res.status(403).json({error: "Your account is deactivated. You cannot update your profile"})
        }
        await Employee.findByIdAndUpdate(employee._id,{bio:req.body.bio})
        return res.json({success:true})
        
    }catch(err){
        return res.status(500).json({error:"Failed to update profile"})
         console.log(err)
    }
    }
