"use client";
import { useState } from "react";
import RolesTab from "@/components/admin/RolesTab";
import LookupValuesTab from "@/components/admin/LookupValuesTab";
import Sidebar from "@/components/sidebar/sidebar";

const TABS = [ "Master Data", "Roles", "Positions"];

export default function AdminSettings(){
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return(
        <div className="flex">
            <Sidebar />
            <div className="p-6  mx-auto w-full">
                <h1 className="text-xl font-medium text-gray-900 ml-15">Admin Settings</h1>
                <p className="text-sm text-gray-500 mt-1 mb-6 ml-15">Manage roles, positions, and lookup data</p>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-gray-200 mb-6">
                    {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm border-b-2 transition-colors ${
                        activeTab === tab
                            ? "border-gray-900 text-gray-900 font-medium"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab}
                    </button>
                    ))}
                </div>

                {activeTab === "Roles" && <RolesTab />}
                {activeTab === "Master Data" && <LookupValuesTab />}

            </div>
        </div>
    );

}