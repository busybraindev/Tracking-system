import { Router } from "express";
import { protect } from "../middleware/Auth.js";
import { getProfile, updateprofile } from "../controllers/Pc.js";

const profileRouter = Router()
profileRouter.get("/",protect,getProfile)
profileRouter.post("/",protect,updateprofile)
export default profileRouter