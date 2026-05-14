import { Router } from "express";
import { protect, protectAdmin } from "../middleware/Auth.js";
import {createLeave, getLeaves, updateLeavesStatus} from "../controllers/Lv.js"
const leaveRouter=Router()
leaveRouter.post("/",protect,createLeave)
leaveRouter.get("/",protect,getLeaves)
leaveRouter.patch("/:id",protect,protectAdmin,updateLeavesStatus)
export default leaveRouter