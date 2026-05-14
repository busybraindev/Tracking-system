import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyPayslipData } from "../assets/assets";
import Ld from "../components/Ld";

const Pp = () => {
  const { id } = useParams();
  const [pp, spp] = useState(null);
  const [ld, sld] = useState(null);
  const formatMonthYear = (year, month) =>
    new Date(year, month - 1).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  useEffect(() => {
    spp(dummyPayslipData.find((slip) => slip._id === id));
    setTimeout(() => {
      sld(false);
    }, 1000);
  }, [id]);
  if (ld) return <Ld></Ld>;
  if (!pp)
    return (
      <p className="text-center py-12 text-slate-400">Payslip not found</p>
    );
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in">
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          PAYSLIP
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {formatMonthYear(pp.year, pp.month)}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Employee Name
          </p>
          <p className="font-semibold text-slate-900">
            {pp.employee?.firstName} {pp.employee?.lastName}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Position
          </p>
          <p className="font-semibold text-slate-900">
            {pp.employee?.position}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Email
          </p>
          <p className="font-semibold text-slate-900">{pp.employee?.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            Period
          </p>
          <p className="font-semibold text-slate-900">
            {formatMonthYear(pp.year, pp.month)}
          </p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Basic Salary</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">
                ${pp.basicSalary?.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Allowances</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">
                +${pp.allowances?.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">Deductions</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">
                -${pp.deductions?.toLocaleString()}
              </td>
            </tr>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="py-4 px-4 font-bold text-slate-900">Net Salary</td>
              <td className="text-right py-3 px-4 font-bold text-slate-900 text-lg">
                ${pp.netSalary?.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center">
          <button
            className="btn-primary print:hidden"
            onClick={() => window.print()}
          >
            Print Payslip
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pp;
