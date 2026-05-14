import { Inngest } from "inngest";
import Attendance from "../models/Ad.js";
import Employee from "../models/Em.js";
import LeaveApplication from "../models/Lv.js";
import sendEmail from "../config/nodemailer.js";

export const inngest = new Inngest({
  id: "Tracking-system",
});

// AUTO CHECKOUT
const autoCheckout = inngest.createFunction(
  { id: "auto-check-out" },
  { event: "employee/check-out" },

  async ({ event, step }) => {
    const { employeeId, attendanceId } = event.data;

    // wait 9 hours
    await step.sleepUntil(
      "wait-for-the-9-hours",
      new Date(Date.now() + 9 * 60 * 60 * 1000)
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

            <p style="font-size:16px;">
              You checked in today in ${employee.department}
            </p>

            <p style="font-size:18px; font-weight:bold; color:#007bff;">
              ${attendance?.checkIn?.toLocaleTimeString()}
            </p>

            <p style="font-size:16px;">
              Please make sure to check out within one hour.
            </p>

            <p style="font-size:16px;">
              If you have questions, contact your admin.
            </p>

            <br />

            <p>Best Regards,</p>
            <p>EMS</p>
          </div>
          `,
        });
      }

      // wait another 1 hour
      await step.sleepUntil(
        "wait-for-the-1-hour",
        new Date(Date.now() + 1 * 60 * 60 * 1000)
      );

      attendance = await Attendance.findById(attendanceId);

      if (!attendance?.checkOut) {
        attendance.checkOut = new Date(
          new Date(attendance.checkIn).getTime() +
            4 * 60 * 60 * 1000
        );

        attendance.workingHours = 4;
        attendance.dayType = "Half Day";
        attendance.status = "LATE";

        await attendance.save();
      }
    }
  }
);

// LEAVE APPLICATION REMINDER
const leaveApplicationReminder = inngest.createFunction(
  { id: "leave-application-reminder" },
  { event: "leave/pending" },

  async ({ event, step }) => {
    const { leaveApplicationId } = event.data;

    await step.sleepUntil(
      "wait-for-the-24-hours",
      new Date(Date.now() + 24 * 60 * 60 * 1000)
    );

    const leaveApplication =
      await LeaveApplication.findById(leaveApplicationId);

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
            <h2>Hi Admin,</h2>

            <p style="font-size:16px;">
              You have a pending leave application from
              ${employee.firstName} ${employee.lastName}
            </p>

            <p style="font-size:16px;">
              Department: ${employee.department}
            </p>

            <p style="font-size:16px;">
              Start Date:
              ${new Date(
                leaveApplication.startDate
              ).toDateString()}
            </p>

            <p style="font-size:16px;">
              Please take action on this leave application.
            </p>

            <br />

            <p>Best Regards,</p>
            <p>EMS</p>
          </div>
          `,
        });
      }
    }
  }
);

// ATTENDANCE REMINDER CRON
const attendanceReminderCron = inngest.createFunction(
  { id: "attendance-reminder-cron" },

  { cron: "TZ=Asia/Kolkata 30 11 * * *" },

  async ({ step }) => {
    // get today's UTC range
    const today = await step.run(
      "get-today-date",
      async () => {
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
      }
    );

    // active employees
    const activeEmployees = await step.run(
      "get-active-employees",
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

    // approved leaves
    const onLeaveIds = await step.run(
      "get-on-leave-ids",
      async () => {
        const leaves = await LeaveApplication.find({
          status: "APPROVED",

          startDate: {
            $lte: new Date(today.endUTC),
          },

          endDate: {
            $gte: new Date(today.startUTC),
          },
        }).lean();

        return leaves.map((l) =>
          l.employeeId.toString()
        );
      }
    );

    // checked in employees
    const checkedInIds = await step.run(
      "get-checked-in-ids",
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

    // absent employees
    const absentEmployees = activeEmployees.filter(
      (emp) =>
        !onLeaveIds.includes(emp._id) &&
        !checkedInIds.includes(emp._id)
    );

    // send reminder emails
    if (absentEmployees.length > 0) {
      await step.run(
        "send-reminder-emails",
        async () => {
          await Promise.all(
            absentEmployees.map((emp) =>
              sendEmail({
                to: emp.email,

                subject:
                  "Attendance Reminder - Please Mark Attendance",

                body: `
                <div style="max-width:600px;">

                  <h2>Hi ${emp.firstName},</h2>

                  <p style="font-size:16px;">
                    We noticed you haven't marked your
                    attendance today.
                  </p>

                  <p style="font-size:16px;">
                    Deadline was <strong>11:30 AM</strong>.
                  </p>

                  <p style="font-size:16px;">
                    Please check in as soon as possible
                    or contact admin if facing issues.
                  </p>

                  <br />

                  <p style="font-size:14px;color:#666;">
                    Department: ${emp.department}
                  </p>

                  <br />

                  <p>Best Regards,</p>
                  <p><strong>QuickEMS</strong></p>

                </div>
                `,
              })
            )
          );
        }
      );
    }

    return {
      totalActive: activeEmployees.length,
      onLeave: onLeaveIds.length,
      checkedIn: checkedInIds.length,
      absent: absentEmployees.length,
    };
  }
);

export const functions = [
  autoCheckout,
  leaveApplicationReminder,
  attendanceReminderCron,
];