import Employee from "../models/Em.js"
import bcrypt from "bcrypt"
import User from "../models/User.js"
export const getemployees = async(req,res)=>{
    try{
        const{department}=req.query
        const where ={}
        if(department) where.department= department
        const employees =(await Emplooye.find(where)).toSorted({createdAt:-1}).populate("userId", "email role").lean()
        const result =employees.map((emp)=>{
            return {...emp,
                id:emp._id.toString(),
                user: emp.userId ? {email: emp.userId.email, role: emp.userId.role}: null
                
        }
        })
        return res.json(result)
    }
    catch(err){
     res.status(500).json({error:"Failed to fecth employees"})
    }
}

export const createEmployee =async(req,res)=>{
    try{
        const{firstName, lastName,email,phone,position, department, basicSalary, allowances, deductions, joinDate,password, role, bio}=req.body
        if(!email ||!password|| !firstName || !lastName){
            return res.status(400).json({error: "Missing required Fields"})
        }
        const hp =await bcrypt.hash(password,10)
        const user =await User.create({
            email, 
            password:hp,
            role: role || "EMPLOYEE"

        }) 
        const employee =await Employee.create({
            userId:user._id,
            firstName,
            lastName,
            email,
            phone,
            position,
            department:department || "ENngineering",
            basicSalary:Number(basicSalary)||0,
            allowances:Number(allowances)||0,
            deductions:Number(deductions)||0,
            joinDate:new Date(joinDate),
            bio:bio ||""


        })

        return res.status(201).json({success:true, employee})
    }
    catch(err){
        if(err.code===11000 ){
            return res.status(400).json({error: "Email already exists"})
        }
        console.log("Create employee error", err);
        return res.status(500).json({error: "failed to create employee"})
        
    }
}

export const updateEmployee =async(req,res)=>{
       try{
        const {id} = req.params
        const{firstName, lastName,email,phone,position, department, basicSalary, allowances, deductions,password, role, employmentStatus}=req.body
       const employee =await Employee.find(id)
        if(!employee){
            return res.status(404).json({error:"Employee not found"})
        }
     
         await Employee.findByIdAndUpdate(id,{
            firstName,
            lastName,
            email,
            phone,
            position,
            department:department || "ENngineering",
            basicSalary:Number(basicSalary)||0,
            allowances:Number(allowances)||0,
            deductions:Number(deductions)||0,
            joinDate:new Date(joinDate),
            bio:bio ||"",
            employmentStatus:employmentStatus|| "ACTIVE"
        })
        const userUpdate= {email}
        if(role) userUpdate.role = role
        if(password) userUpdate.password =await bcrypt.hash(password,10)
            await User.findByIdAndUpdate(employee.userId,userUpdate)

        return res.json({success:true})
    }
    catch(err){
        if(err.code===11000 ){
            return res.status(400).json({error: "Email already exists"})
        }
       
        return res.status(500).json({error: "failed to update employee"})
        
    }
}
export const deleteEmployee=async(req, res)=>{
    try{
        const{id}=req.params
        const employee =await Employee.findById(id)
        if(!employee){
            return res.status(404).json({error: "Employee not found"})
        }
        employee.isDeleted=true;
        employee.employmentStatus="INACTIVE"
        await employee.save()
        return res.json({success:true})
    }
    catch(err){
        return res.status(500).json({error: "Failed to delete employee"})
    }
}
