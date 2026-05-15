import { Inngest } from "inngest";
import Attendance from "../models/Ad.js";
import Employee from "../models/Em.js";
import LeaveApplication from "../models/Lv.js";
import sendEmail from "../config/nodemailer.js";

export const inngest = new Inngest({
  id: "Tracking-system",
});


// ========================
// AUTO CHECKOUT
// ========================
const autoCheckout = inngest.createFunction(
  {
    id: "auto-check-out",
    triggers: [{ event: "employee/check-out" }],
  },

  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    await step.sleepUntil(
      "wait-9-hours",
      // new Date(Date.now() + 9 * 60 * 60 * 1000)
      new Date(Date.now() + 30 * 1000)
    );

    let attendance = await Attendance.findById(attendanceId);

    if (!attendance?.checkOut) {
      const employee = await Employee.findById(employeeId);

      if (employee) {
        await sendEmail({
          to: employee.email,
          subject: "Attendance Check-Out Reminder",
          body: `
            <div style="max-width:600px;">
              <h2>Hi ${employee.firstName},</h2>

              <p>You are still checked in at ${employee.department}</p>

              <p style="font-weight:bold;">
                ${attendance?.checkIn?.toLocaleTimeString()}
              </p>

              <p>Please check out within 1 hour.</p>
            </div>
          `,
        });
      }

      await step.sleepUntil(
        "wait-1-hour",
        // new Date(Date.now() + 1 * 60 * 60 * 1000)
       
  new Date(Date.now() + 20 * 1000)
)

      attendance = await Attendance.findById(attendanceId);

      if (!attendance?.checkOut) {
        attendance.checkOut = new Date(
          new Date(attendance.checkIn).getTime() + 4 * 60 * 60 * 1000
        );

        attendance.workingHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";

        await attendance.save();
      }
    }
  }
);


// ========================
// LEAVE REMINDER
// ========================
const leaveApplicationReminder = inngest.createFunction(
  {
    id: "leave-application-reminder",
    triggers: [{ event: "leave/pending" }],
  },

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    await step.sleepUntil(
      "wait-24-hours",
      new Date(Date.now() + 30 * 1000)
      // new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    const leaveApplication = await LeaveApplication.findById(
      leaveApplicationId
    );

    if (leaveApplication?.status === "PENDING") {
      const employee = await Employee.findById(
        leaveApplication.employeeId
      );

      if (employee) {
        await sendEmail({
          to: process.env.ADMIN_EMAIL,
          subject: "Leave Application Reminder",
          body: `
            <div style="max-width:600px;">
              <h2>Hi Admin</h2>

              <p>
                Pending leave from ${employee.firstName}
                ${employee.lastName}
              </p>

              <p>
                Department: ${employee.department}
              </p>

              <p>
                Start Date: ${new Date(
                  leaveApplication.startDate
                ).toDateString()}
              </p>

              <p>Please review it.</p>
            </div>
          `,
        });
      }
    }
  }
);


// ========================
// ATTENDANCE CRON
// ========================
const attendanceReminderCron = inngest.createFunction(
  {
    id: "attendance-reminder-cron",
    triggers: [{ cron: "TZ=Asia/Kolkata 30 11 * * *" }],
  },

  async ({ step }) => {
    const today = await step.run("get-today", async () => {
      const startUTC = new Date(
        new Date().toLocaleDateString("en-CA", {
          timeZone: "Asia/Kolkata",
        }) + "T00:00:00+05:30"
      );

      const endUTC = new Date(
        startUTC.getTime() + 24 * 60 * 60 * 1000
      );

      return {
        startUTC: startUTC.toISOString(),
        endUTC: endUTC.toISOString(),
      };
    });

    const activeEmployees = await step.run(
      "get-employees",
      async () => {
        const employees = await Employee.find({
          isDeleted: false,
          employmentStatus: "ACTIVE",
        }).lean();

        return employees.map((e) => ({
          _id: e._id.toString(),
          firstName: e.firstName,
          lastName: e.lastName,
          email: e.email,
          department: e.department,
        }));
      }
    );

    const onLeaveIds = await step.run(
      "get-leaves",
      async () => {
        const leaves = await LeaveApplication.find({
          status: "APPROVED",
          startDate: { $lte: new Date(today.endUTC) },
          endDate: { $gte: new Date(today.startUTC) },
        }).lean();

        return leaves.map((l) =>
          l.employeeId.toString()
        );
      }
    );

    const checkedInIds = await step.run(
      "get-attendance",
      async () => {
        const attendance = await Attendance.find({
          date: {
            $gte: new Date(today.startUTC),
            $lt: new Date(today.endUTC),
          },
        }).lean();

        return attendance.map((a) =>
          a.employeeId.toString()
        );
      }
    );

    const absentEmployees = activeEmployees.filter(
      (emp) =>
        !onLeaveIds.includes(emp._id) &&
        !checkedInIds.includes(emp._id)
    );

    if (absentEmployees.length > 0) {
      await step.run("send-emails", async () => {
        await Promise.all(
          absentEmployees.map((emp) =>
            sendEmail({
              to: emp.email,
              subject: "Attendance Reminder",
              body: `
                <div style="max-width:600px;">
                  <h2>Hi ${emp.firstName}</h2>
                  <p>You haven't marked attendance today.</p>
                   <p>The deadline was <strong>11:30 pm</strong> and your attendnace is missing</.</p>

                   <p>Please check in as soon as possible or contact your admin if u are facing issues.</p>
                   <p>Department: ${emp.department}</p>
                    <p>Best Regards.</p>
                    <p><strong>QUICKEMS</strong></p>
                </div>
              `,
            })
          )
        );
      });
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  }
);


// ========================
// EXPORT
// ========================
export const functions = [
  autoCheckout,
  leaveApplicationReminder,
  attendanceReminderCron,
];