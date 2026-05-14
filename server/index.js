import express from "express"
import cors from "cors"
import "dotenv/config"
import multer from "multer"
import connecDb from "./config/db.js"
import authRouter from "./routes/auth.js"
import employeeRoutes from "./routes/Em.js"
import profileRouter from "./routes/Pc.js"
import attendanceRouter from "./routes/Ar.js"
import leaveRouter from "./routes/Lv.js"
import payslipRouter from "./routes/Ps.js"
import dashboardRouter from "./routes/Dh.js"
import {serve} from "inngest/express"
import {inngest, functions} from "./inngest/index.js"

const app= express()
const PORT =process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(multer().none())
await connecDb()


app.use('/api/auth',authRouter)
app.use("/api/employees", employeeRoutes)
app.use("/api/profile",profileRouter)
app.use("/api/attendance",attendanceRouter)
app.use("/api/leave",leaveRouter)
app.use("/api/payslips",payslipRouter)
app.use("/api/dashboard",dashboardRouter)
app.use('/api/inngest', serve({client:inngest, functions})
)
app.listen(PORT, ()=>console.log(`Server is running at port ${PORT}`))
