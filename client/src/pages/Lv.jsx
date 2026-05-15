import React, { useCallback, useEffect, useState } from "react";
import { dummyLeaveData } from "../assets/assets";
import Ld from "../components/Ld";
import {
  PalmtreeIcon,
  PlusIcon,
  ThermometerIcon,
  UmbrellaIcon,
} from "lucide-react";
import Lh from "../components/Leave/Lh";
import Al from "../components/Leave/Al";
import { useAuth } from "../context/Auth";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Lv = () => {
  const [lv, ssl] = useState([]);
  const [ld, sld] = useState(true);
  const [sh, ssh] = useState(false);
  const [isd, sisd] = useState(false);
  const { us } = useAuth();
  const isAdmin = us?.role === "ADMIN";
  const fl = useCallback(async () => {
    try {
      const res = await api.get("/leave");
      ssl(res.data.data || []);
      if (res.data.employee?.isDeleted) sisd(true);
    } catch (err) {
      toast.error(err.response?.data?.error);
    } finally {
      sld(false);
    }
  }, []);
  useEffect(() => {
    fl();
  }, [fl]);
  if (ld) return <Ld></Ld>;
  const approvedLeaves = lv.filter((l) => l.status === "APPROVED");
  const sickCount = approvedLeaves.filter((l) => l.type === "SICK").length;
  const casualCount = approvedLeaves.filter((l) => l.type === "CASUAL").length;
  const annualCount = approvedLeaves.filter((l) => l.type === "ANNUAL").length;
  const leaveStats = [
    {
      label: "Sick Leave",
      value: sickCount,
      icon: ThermometerIcon,
    },
    {
      label: "Casual Leave",
      value: casualCount,
      icon: UmbrellaIcon,
    },
    {
      label: "Annual Leave",
      value: annualCount,
      icon: PalmtreeIcon,
    },
  ];
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Manage leave applications"
              : "Your leave History and requests"}
          </p>
        </div>
        {!isAdmin && !isd && (
          <button
            onClick={() => ssh(true)}
            className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="w-4 h-4"></PlusIcon> Apply for Leave
          </button>
        )}
      </div>
      {!isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
          {leaveStats.map((s) => {
            return (
              <div
                key={s.label}
                className="card card-hover p-5 sm:p-6 flex items-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70"></div>
                <div className="p-3 bg-slate-100 rounded-lg group-hover:bg-indigo-50 transition-colors duration-200">
                  <s.icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-200"></s.icon>
                </div>
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {s.value}{" "}
                    <span className="text-sm font-normal text-slate-400">
                      taken
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Lh leaves={lv} isAdmin={isAdmin} onUpdate={fl}></Lh>
      <Al open={sh} onClose={() => ssh(false)} onSuccess={fl}></Al>
    </div>
  );
};

export default Lv;
