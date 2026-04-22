"use client";

import Sidebar from "@/components/sidebar/sidebar";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function Home() {
  const { token, setToken } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    setToken("");
    router.push("/auth/login");
  };

  return (
    <div className="flex">
  <Sidebar />

  <div className="flex-1 min-h-screen bg-gray-100">
    
    {/* Navbar */}
    <nav className="bg-white shadow-md px-8 py-4 flex justify-end items-center">
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-semibold"
      >
        Logout
      </button>
    </nav>

    {/* Content */}
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome Back 👋 
      </h2>

        {/* Cards */} 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6"> 
          <div className="bg-white p-6 rounded-xl shadow-md"> 
            <h3 className="text-gray-500 text-sm">Total Employees</h3> 
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p> 
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-md"> 
            <h3 className="text-gray-500 text-sm">Present Today</h3> 
            <p className="text-3xl font-bold text-green-600 mt-2">0</p> 
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-md"> 
            <h3 className="text-gray-500 text-sm">On Leave</h3> 
            <p className="text-3xl font-bold text-red-500 mt-2">0</p> 
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md"> 
            <h3 className="text-gray-500 text-sm">On Leave</h3> 
            <p className="text-3xl font-bold text-red-500 mt-2">0</p> 
          </div>
           </div>
    </div>

  </div>
</div>
  )
}