import React, { useCallback, useEffect, useState } from "react";
import { dummyAttendanceData } from "../assets/assets";
import Ld from "../components/Ld";
import Cb from "../components/Attendance/Cb";
import As from "../components/Attendance/As";
import Ah from "../components/Attendance/Ah";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Ad = () => {
  const [ht, sth] = useState([]);
  const [ld, sld] = useState(true);
  const [dt, std] = useState(false);
  const fd = useCallback(async () => {
    try {
      const rs = await api.get("/attendance");
      const json = rs.data;
      sth(json.data);
      if (json.employee?.isDeleted) std(true);
    } catch (err) {
      toast.error(err?.response?.data?.error || err?.message);
    } finally {
      sld(false);
    }
  });
  useEffect(() => {
    fd();
  }, [fd]);
  if (ld) return <Ld></Ld>;
  const td = new Date();
  td.setHours(0, 0, 0, 0);
  const tr = ht.find(
    (r) => new Date(r.date).toDateString() === td.toDateString(),
  );
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendance</h1>
        <p className="page-subtitle">
          Track your work hours and daily checks-ins
        </p>
      </div>
      {dt ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-rose-600">
            You can no longer clock in or out because your employee records have
            been marked as deleted.
          </p>
        </div>
      ) : (
        <div className="mb-8">
          <Cb todayRecord={tr} onAction={fd}></Cb>
        </div>
      )}
      <As history={ht}></As>
      <Ah history={ht}></Ah>
    </div>
  );
};

export default Ad;
