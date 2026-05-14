import {Router} from "express"
import { createEmployee, deleteEmployee, getemployees, updateEmployee } from "../controllers/em.js"
import { protect, protectAdmin } from "../middleware/Auth.js"
const employeeRoutes=Router()
employeeRoutes.get('/',protect,protectAdmin, getemployees)
employeeRoutes.post("/", protect,protectAdmin,createEmployee)
employeeRoutes.put("/:id",protect,protectAdmin, updateEmployee)
employeeRoutes.delete('/:id',protect,protectAdmin, deleteEmployee)
export default employeeRoutes;