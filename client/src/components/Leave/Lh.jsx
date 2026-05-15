import { Check, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import api from "../../api/axios";
const Lh = ({ leaves, isAdmin, onUpdate }) => {
  const [pc, spc] = useState(null);
  const hs = async (id, status) => {
    spc(id);
    try {
      await api.patch(`/leave/${id}`, { status });
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.error || err?.message);
    } finally {
      spc(null);
    }
  };
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table-modern">
          <thead>
            <tr>
              {isAdmin && <th>Employee</th>}
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              {isAdmin && <th className="text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 4}
                  className="text-center py-12 text-slate-400"
                >
                  No leave application found
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                return (
                  <tr key={leave._id || leave.id}>
                    {isAdmin && (
                      <td className="text-slate-900">
                        {leave.employee?.firstName}
                        {leave.employee?.lastName}
                      </td>
                    )}

                    <td>
                      <span className="badge bg-slate-100 text-slate-600">
                        {leave.type}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {formatDate(leave.startDate)} -{" "}
                      {formatDate(leave.endDate)}
                    </td>
                    <td
                      className="max-w-xs truncate text-slate-500"
                      title={leave.reason}
                    >
                      {leave.reason}
                    </td>
                    <td>
                      <span
                        className={`badge ${leave.status === "APPROVED" ? "badge-success " : leave.status === "REJECTED" ? "badge-danger" : "badge-warning"}`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        {leave.status === "PENDING" && (
                          <div className="flex justify-between gap-2">
                            <button
                              onClick={() =>
                                hs(leave._id || leave.id, "APPROVED")
                              }
                              disabled={!!pc}
                              className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                              {pc === (leave._id || leave.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin"></Loader2>
                              ) : (
                                <Check className="w-4 h-4"></Check>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                hs(leave._id || leave.id, "REJECTED")
                              }
                              disabled={!!pc}
                              className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              {pc === (leave._id || leave.id) ? (
                                <Loader2 className="w-4 h-4 animate-spin"></Loader2>
                              ) : (
                                <X className="w-4 h-4"></X>
                              )}
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lh;
