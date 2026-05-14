import React from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Lg from "./pages/Lg.jsx";
import Dh from "./pages/Dh.jsx";
import Lt from "./pages/Lt.jsx";
import Em from "./pages/Em.jsx";
import Ad from "./pages/Ad.jsx";
import Lv from "./pages/Lv.jsx";
import Ps from "./pages/Ps.jsx";
import St from "./pages/St.jsx";
import Pp from "./pages/Pp.jsx";
import Lf from "./components/Lf.jsx";
const App = () => {
  return (
    <>
      <Toaster></Toaster>
      <Routes>
        <Route path="/login" element={<Lg></Lg>}></Route>
        <Route
          path="/login/admin"
          element={
            <Lf
              role="admin"
              title="Admin Portal"
              subtitle="Sign in to manage the organization"
            ></Lf>
          }
        ></Route>
        <Route
          path="/login/employee"
          element={
            <Lf
              role="employee"
              title="Employee Portal"
              subtitle="Sign in to access your account"
            ></Lf>
          }
        ></Route>
        <Route element={<Lt></Lt>}>
          <Route path="/dashboard" element={<Dh></Dh>}></Route>
          <Route path="/employees" element={<Em></Em>}></Route>
          <Route path="/attendance" element={<Ad></Ad>}></Route>
          <Route path="/leave" element={<Lv></Lv>}></Route>
          <Route path="/payslips" element={<Ps></Ps>}></Route>
          <Route path="/settings" element={<St></St>}></Route>
        </Route>
        <Route path="/print/payslips/:id" element={<Pp></Pp>}></Route>
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace></Navigate>}
        ></Route>
      </Routes>
    </>
  );
};

export default App;
