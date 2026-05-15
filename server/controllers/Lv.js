import { inngest } from "../inngest/index.js"
import Employee from "../models/Em.js"
import LeaveApplication from "../models/Lv.js"

export const createLeave = async (req, res) => {
  try {
    const session = req.session;

    const employee = await Employee.findOne({
      userId: session.userId,
    });

    if (!employee)
      return res.status(404).json({ error: "Employee not found" });

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account has been disabled, you can't apply for leave",
      });
    }

    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (start < today || end < today) {
      return res.status(400).json({
        error: "Leave dates must be in the future",
      });
    }

    if (end < start) {
      return res.status(400).json({
        error: "End date cannot be before start date",
      });
    }

    const leave = await LeaveApplication.create({
      employeeId: employee._id,
      type,
      startDate: start,
      endDate: end,
      reason,
      status: "PENDING",
    });

    await inngest.send({
      name: "leave/pending",
      data: {
        leaveApplicationId: leave._id,
      },
    });

    return res.json({ success: true, data: leave });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed" });
  }
};
export const getLeaves = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    if (isAdmin) {
      const status = req.query.status;
      const where = status ? { status } : {};

      const leaves = await LeaveApplication.find(where)
        .populate("employeeId")
        .sort({ createdAt: -1 })
        .lean();

      const data = leaves.map((l) => ({
        ...l,
        id: l._id.toString(),
        employeeId: l.employeeId?._id?.toString(),
        employee: l.employeeId,
      }));

      return res.json({ data });
    }

    const employee = await Employee.findOne({
      userId: session.userId,
    }).lean();

    if (!employee) {
      return res.status(404).json({ error: "Not Found" });
    }

    const leaves = await LeaveApplication.find({
      employeeId: employee._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      data: leaves,
      employee: {
        ...employee,
        id: employee._id.toString(),
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed" });
  }
};
export const updateLeavesStatus =async(req,res)=>{
    try{
        const {status}=req.body
        if(!["APPROVED","REJECTED","PENDING"].includes(status)){
            return res.status(400).json({error:"Invalid Status"})
        }
        const leave =await LeaveApplication.findByIdAndUpdate(req.params.id,{status} , {returnDocument:"after"})
        return res.json({success:true, data:leave})
    }
      catch(err){
        return res.status(500).json({error:"Failed"})
    }
}