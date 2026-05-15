import React, { useState } from "react";
import Ls from "./Ls";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import { useAuth } from "../context/Auth";
import toast from "react-hot-toast";

const Lf = ({ role, title, subtitle }) => {
  const [em, sem] = useState("");
  const [ps, sps] = useState("");
  const [sp, shp] = useState(false);
  const [er, ser] = useState("");
  const [ld, sld] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const hs = async (e) => {
    e.preventDefault();
    ser("");
    sld(true);
    try {
      await login(em, ps, role);
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Login Failed");
    } finally {
      sld(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Ls></Ls>
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <Link
            to={"/login"}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors"
          >
            <ArrowLeftIcon size={16}></ArrowLeftIcon> Back to portals
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium to-zinc-800">
              {title}
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">
              {subtitle}
            </p>
          </div>
          {er && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
              {er}
            </div>
          )}
          <form className="space-y-5" onSubmit={hs}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={em}
                onChange={(e) => sem(e.target.value)}
                required
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={sp ? "text" : "password"}
                  onChange={(e) => sps(e.target.value)}
                  required
                  placeholder="......"
                  className="pr-11"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => shp(!sp)}
                >
                  {sp ? (
                    <EyeOffIcon size={18}></EyeOffIcon>
                  ) : (
                    <EyeIcon size={18}></EyeIcon>
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={ld}
              className="w-full py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center"
            >
              {ld && (
                <Loader2Icon className="animate-spin h-4 w-4 mr-2"></Loader2Icon>
              )}{" "}
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Lf;
