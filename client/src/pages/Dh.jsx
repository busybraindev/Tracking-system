import React, { useEffect, useState } from "react";
import {
  dummyAdminDashboardData,
  dummyEmployeeDashboardData,
} from "../assets/assets";
import Ld from "../components/Ld";
import Ed from "../components/Ed";
import Ad from "../components/Ad";

const Dh = () => {
  const [dt, sdt] = useState(null);
  const [ld, sld] = useState(true);
  useEffect(() => {
    sdt(dummyAdminDashboardData);
    // sdt(dummyEmployeeDashboardData);
    setTimeout(() => {
      sld(false);
    }, 1000);
  }, []);
  if (ld) return <Ld></Ld>;
  if (!dt)
    return (
      <p className="text-center text-slate-500 py-12">
        Failed to load dashboard
      </p>
    );
  if (dt.role === "ADMIN") {
    return <Ad data={dt}></Ad>;
  } else {
    return <Ed data={dt}></Ed>;
  }
};

export default Dh;
