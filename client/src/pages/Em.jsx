import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { dummyEmployeeData, DEPARTMENTS } from "../assets/assets";
import { Plus, Search, X } from "lucide-react";
import Ec from "../components/Ec";
import Fm from "../components/Fm";

const Em = () => {
  const [em, sem] = useState([]);
  const [ld, sld] = useState(true);
  const [sc, ssc] = useState("");
  const [st, ssd] = useState("");
  const [ed, sed] = useState(null);
  const [sm, ssm] = useState(false);
  const ft = useCallback(async () => {
    sld(true);
    sem(dummyEmployeeData.filter((emp) => (st ? emp.department === st : emp)));
    setTimeout(() => {
      sld(false);
    }, 1000);
  }, [st]);
  useEffect(() => {
    ft();
  }, [ft]);
  const filtered = em.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.position}`
      .toLowerCase()
      .includes(sc.toLowerCase()),
  );
  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <button
          onClick={() => ssm(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={16}></Plus> Add Employee
        </button>
      </div>
      <div className="flex flex-col sm:flex-row  gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"></Search>
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10!"
            onChange={(e) => ssc(e.target.value)}
            value={sc}
          />
        </div>
        <select
          value={st}
          onChange={(e) => ssd(e.target.value)}
          className="max-w-40"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      {ld ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">
              No employee found
            </p>
          ) : (
            filtered.map((emp) => (
              <Ec
                key={emp.id}
                employee={emp}
                onDelete={ft}
                onEdit={(e) => sed(e)}
              ></Ec>
            ))
          )}
        </div>
      )}
      {sm && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => ssm(false)}
        >
          <div className="fixed inset-0"></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Employee
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Create a user account and employee profile
                </p>
              </div>
              <button
                onClick={() => ssm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5"></X>
              </button>
            </div>
            <div className="p-6">
              <Fm
                onSuccess={() => {
                  return ssm(false);
                  ft();
                }}
                onCancel={() => ssm(false)}
              ></Fm>
            </div>
          </div>
        </div>
      )}
      {ed && (
        <div
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={() => sed(false)}
        >
          {" "}
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Edit Employee
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Update employee details
                </p>
              </div>
              <button
                onClick={() => sed(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5"></X>
              </button>
            </div>
            <div className="p-6">
              <Fm
                initialData={ed}
                onSuccess={() => {
                  return sed(null);
                  ft();
                }}
                onCancel={() => sed(null)}
              ></Fm>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Em;
