import { Router } from "express";
import { protect } from "../middleware/Auth.js";
import { getDashboard } from "../controllers/Dh.js";

const dashboardRouter =Router()
dashboardRouter.get("/",protect,getDashboard)
export default dashboardRouter