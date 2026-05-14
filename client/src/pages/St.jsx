import React, { useEffect, useState } from "react";
import { dummyProfileData } from "../assets/assets";
import Ld from "../components/Ld";
import { Lock } from "lucide-react";
import Pf from "../components/Pf";
import Cp from "../components/Cp";

const St = () => {
  const [pf, spf] = useState(null);
  const [ld, sld] = useState(true);
  const [sp, ssh] = useState(false);
  const fp = async () => {
    spf(dummyProfileData);
    setTimeout(() => {
      sld(false);
    }, 1000);
  };
  useEffect(() => {
    fp();
  }, [fp]);
  if (ld) return <Ld></Ld>;
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>
      {pf && <Pf initialData={pf} onSuccess={fp}></Pf>}
      <div className="card max-w-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600"></Lock>
          </div>
          <div>
            <p className="font-medium text-slate-900">Password</p>
            <p className="text-sm text-slate-500">
              Update your account Password
            </p>
          </div>
        </div>
        <button className="btn-secondary text-sm" onClick={() => ssh(true)}>
          Change
        </button>
      </div>
      <Cp open={sp} onClose={() => ssh(false)}></Cp>
    </div>
  );
};

export default St;
