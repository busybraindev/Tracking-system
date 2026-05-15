import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DEPARTMENTS } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Fm = ({ initialData, onSuccess, onCancel }) => {
  const nav = useNavigate();
  const [ld, sld] = useState(false);
  const isEdit = !!initialData;
  const hs = async (e) => {
    e.preventDefault();
    sld(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) {
      const pwd = formData.get("password");
      if (!pwd) formData.delete("password");
    }
    try {
      const url = isEdit ? `/employees/${initialData.id}` : "/employees";
      const method = isEdit ? "put" : "post";
      await api[method](url, formData);
      onSuccess ? onSuccess() : nav("/employees");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      sld(false);
    }
  };
  return (
    <form onSubmit={hs} className="space-y-6 max-w-3xl animate-fade-in">
      <div className="card p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2">First Name</label>
            <input
              name="firstName"
              type="text"
              required
              defaultValue={initialData?.firstName}
            />
          </div>
          <div>
            <label className="block mb-2">Last Name</label>
            <input
              name="lastName"
              type="text"
              required
              defaultValue={initialData?.lastName}
            />
          </div>
          <div>
            <label className="block mb-2">Phone Number</label>
            <input
              type="text"
              required
              defaultValue={initialData?.phone}
              name="phone"
            />
          </div>
          <div>
            <label className="block mb-2">Join Date</label>
            <input
              type="date"
              name="joinDate"
              required
              defaultValue={
                initialData?.joinDate
                  ? new Date(initialData.joinDate).toISOString().split("T")[0]
                  : ""
              }
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-2">Bio(Optional)</label>
            <textarea
              name="bio"
              defaultValue={initialData?.bio}
              rows={3}
              className="resize-none"
              placeholder="Brief description....."
            ></textarea>
          </div>
        </div>
      </div>
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-10">
          Employment Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <label className="block mb-2"></label>
            <select
              name="department"
              defaultValue={initialData?.department || ""}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => {
                return (
                  <option value={dept} key={dept}>
                    {dept}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block mb-2">Position</label>
            <input
              type="text"
              required
              defaultValue={initialData?.position}
              name="position"
            />
          </div>
          <div>
            <label className="block mb-2">Basci Salary</label>
            <input
              type="number"
              required
              defaultValue={initialData?.basicSalary || ""}
              min={"0"}
              step={"0.01"}
              name="basicSalary"
            />
          </div>
          <div>
            <label className="block mb-2">Allowances</label>
            <input
              type="number"
              required
              defaultValue={initialData?.allowances || 0}
              name="allowances"
              min={"0"}
              step={"0.01"}
            />
          </div>
          <div>
            <label className="block mb-2">Deductions</label>
            <input
              type="number"
              required
              defaultValue={initialData?.deductions || 0}
              name="deductions"
              min={"0"}
              step={"0.01"}
            />
          </div>
          {isEdit && (
            <div>
              <label className="block mb-2">Status</label>
              <select
                required
                defaultValue={initialData?.employeeStatus}
                name="employeeStatus"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>
      <div className="card p-5 sm:p-6">
        <h3 className="text-base font-medium  text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Account Setup
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
          <div className="sm:col-span-2">
            <label className="block mb-2">Work Email</label>
            <input
              name="email"
              type="email"
              required
              defaultValue={initialData?.email}
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block mb-2">Temporary Password</label>
              <input name="password" type="password" required />
            </div>
          )}

          {isEdit && (
            <div>
              <label className="block mb-2">Change Password(Optional)</label>
              <input
                name="password"
                type="password"
                placeholder="Leave blank to keep current"
              />
            </div>
          )}
          <div>
            <label className="block mb-2">System Role</label>
            <select
              name="role"
              defaultValue={initialData?.user?.role || "EMPLOYEE"}
            >
              <option value="EMPLOYEE">Employee</option>
              <option value={"ADMIN"}>Admin</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => (onCancel ? onCancel() : nav(-1))}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex items-center justify-center"
          disabled={ld}
        >
          {ld && (
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin"></Loader2Icon>
          )}
          {isEdit ? "Updated Employee" : "Create Employee"}
        </button>
      </div>
    </form>
  );
};

export default Fm;
