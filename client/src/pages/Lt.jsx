import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Sb from "../components/Sb";
import { useAuth } from "../context/Auth";
import Ld from "../components/Ld";

const Lt = () => {
  const { us, ld } = useAuth();
  if (ld) return <Ld></Ld>;
  if (!us) return <Navigate to={"/login"}></Navigate>;
  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
      <Sb></Sb>
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
          <Outlet></Outlet>
        </div>
      </main>
    </div>
  );
};

export default Lt;
