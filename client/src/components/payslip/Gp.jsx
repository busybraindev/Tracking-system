import { Loader2, Plus, X } from "lucide-react";
import React, { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

const Gp = ({ employees, onSuccess }) => {
  const [ip, sip] = useState(false);
  const [ld, sld] = useState(false);
  if (!ip)
    return (
      <button
        onClick={() => sip(true)}
        className="btn-primary flex items-center gap-2"
      >
        <Plus className="w-4 h-4"></Plus> Generate Payslip
      </button>
    );
  const hs = async (e) => {
    e.preventDefault();
    sld(true);
    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata.entries());
    try {
      await api.post("/payslips", data);
      sip(false);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message);
    } finally {
      sld(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-900">
            Generate Monthly Payslip
          </h3>
          <button
            onClick={() => sip(false)}
            className="text-slate-400 hover:text-slate-400 p-1"
          >
            <X size={20}></X>
          </button>
        </div>
        <form onSubmit={hs} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Employee
            </label>
            <select name="employeeId" required>
              {employees.map((e) => (
                <option value={e.id}>
                  {e.firstName} {e.lastName} ({e.position})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Month
              </label>
              <select name="month">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Year
              </label>
              <input
                type="number"
                name="year"
                defaultValue={new Date().getFullYear()}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Basic Salary
            </label>
            <input
              type="number"
              name="basicSalary"
              required
              placeholder="5000"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Allowances
              </label>
              <input type="number" name="allowances" defaultValue="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deductions
              </label>
              <input type="number" name="deductions" defaultValue="0" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => sip(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center"
              disabled={ld}
            >
              {" "}
              {ld && <Loader2 className="w-4 h-4 mr-2 animate-spin"></Loader2>}
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Gp;
