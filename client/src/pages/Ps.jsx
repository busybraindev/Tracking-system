import React, { useCallback, useEffect, useState } from "react";
import { dummyEmployeeData, dummyPayslipData } from "../assets/assets";
import Ld from "../components/Ld";
import PL from "../components/payslip/PL";
import Gp from "../components/payslip/Gp";
import { useAuth } from "../context/Auth";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const Ps = () => {
  const [ps, sps] = useState([]);
  const [em, sem] = useState([]);
  const [ld, sld] = useState(true);
  const { us } = useAuth();
  const isAdmin = us?.role === "ADMIN";
  const fp = useCallback(async () => {
    try {
      const res = await api.get("/payslips");
      console.log(res);
      sps(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message);
    } finally {
      sld(false);
    }
  }, []);
  useEffect(() => {
    fp();
  }, [fp]);
  useEffect(() => {
    if (isAdmin)
      api
        .get("/employees")
        .then((res) => sem(res.data.filter((e) => !e.isDeleted)))
        .catch(() => {});
  }, [isAdmin]);
  if (ld) return <Ld></Ld>;
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">
            {isAdmin
              ? "Generate and manage employee payslips"
              : "Your payslip history"}
          </p>
        </div>
        {isAdmin && <Gp employees={em} onSuccess={fp}></Gp>}
      </div>
      <PL payslips={ps} isAdmin={isAdmin}></PL>
    </div>
  );
};

export default Ps;
