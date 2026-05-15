import { Loader2, User, Save } from "lucide-react";
import React, { useState } from "react";
import api from "../api/axios";

const Pf = ({ initialData, onSuccess }) => {
  const [ld, sld] = useState(false);
  const [er, ser] = useState("");
  const [ms, sms] = useState("");
  const hs = async (e) => {
    e.preventDefault();
    sld(true);
    ser("");
    sms("");
    const formData = new FormData(e.currentTarget);
    try {
      await api.post("/profile", formData);
      sms("Profile updated succesfully");
      onSuccess?.();
    } catch (err) {
      ser(er.response?.data?.error || err.message);
    } finally {
      sld(false);
    }
  };
  return (
    <form onSubmit={hs} className="card p-5 sm:p-6 mb-6">
      <h2 className="text-base font-medium to-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
        <User className="w-5 h-5 text-slate-400"></User> Public Profile
      </h2>
      {er && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-xl text-sm border border-rose-200 mb-6 flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
          {er}
        </div>
      )}
      {ms && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm border border-emerald-200 mb-6 flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
          {ms}
        </div>
      )}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Name
            </label>
            <input
              disabled
              value={`${initialData?.firstName} ${initialData?.lastName}`}
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              disabled
              value={initialData?.email}
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Position
            </label>
            <input
              disabled
              value={initialData?.position}
              className="bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bio
          </label>
          <textarea
            disabled={initialData?.isDeleted}
            name="bio"
            defaultValue={initialData?.bio || ""}
            placeholder="Write a brief bio..."
            className={`resize-none ${initialData?.isDeleted ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}`}
          ></textarea>
          <p className="text-xs text-slate-400 mt-1.5">
            This will be displayed on your profile
          </p>
        </div>
        {initialData?.isDeleted ? (
          <div className="pt-2">
            <p className="text-rose-600 font-medium tracking-tight">
              Account Deactivated
            </p>
            <p className="text-sm text-red-500 mt-0.5">
              You can no longer update your profile
            </p>
          </div>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={ld}
              className="btn-primary flex items-center gap-2 justify-center w-full sm:w-auto"
            >
              {ld ? (
                <Loader2 className="w-4 h-4 animate-spin"></Loader2>
              ) : (
                <Save className="w-4 h-4"></Save>
              )}
              Save Changes
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Pf;
