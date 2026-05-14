import { Router } from "express";
import { protect, protectAdmin } from "../middleware/Auth.js";
import { createpaySlips, getPayslipById, getPayslips } from "../controllers/Ps.js";

const payslipRouter=Router()
payslipRouter.post("/",protect,protectAdmin,createpaySlips)
payslipRouter.get("/",protect,getPayslips),
payslipRouter.get("/:id",protect,getPayslipById)
export default payslipRouter