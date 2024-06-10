import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <header className="fixed top-0 z-50 w-full bg-white shadow-md">
        <Navbar />
      </header>
      <main className="flex-grow mt-24">
        <Outlet />
      </main>
      <footer className="bg-gray-100 mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
