import {Router} from "express"
import { protect } from "../middleware/Auth.js"
import { clockInOut, getAttendance } from "../controllers/At.js"

const attendanceRouter=Router()
attendanceRouter.post("/", protect, clockInOut)
attendanceRouter.get("/",protect, getAttendance)
export default attendanceRouter;