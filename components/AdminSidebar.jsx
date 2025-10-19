"use client";

import React, { useEffect, useRef } from "react";
import {
  FaHome,
  FaTimes,
  FaChalkboardTeacher,
  FaImages,
  FaBriefcase,
  FaUniversity,
} from "react-icons/fa";

const AdminSidebar = ({
  showSidebar,
  setShowSidebar,
  setActiveComponent,
  activeComponent,
}) => {
  const sidebarRef = useRef(null);

  // Handle click outside to close sidebar on mobile
  useEffect(() => {
    function handleClickOutside(event) {
      // Only handle clicks outside when sidebar is shown and we're on mobile
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768 &&
        // Make sure we're not clicking the toggle button itself
        !event.target.closest('button[aria-label="Toggle Sidebar"]')
      ) {
        // Use the setShowSidebar prop directly instead of simulating a click
        setShowSidebar(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, setShowSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={`w-64 h-screen fixed md:relative transition-all duration-300 z-20 ${
        showSidebar ? "left-0" : "-left-64 md:left-0"
      }`}
      style={{ backgroundColor: "var(--sidebar-bg)" }}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--sidebar-text)" }}
          >
            zDemy Admin
          </h2>
          {/* Close button - visible only on mobile */}
          <button
            className="md:hidden hover:opacity-80"
            onClick={() => setShowSidebar(false)}
            aria-label="Close Sidebar"
            style={{ color: "var(--sidebar-text)" }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveComponent("dashboard")}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === "dashboard"
                    ? ""
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    activeComponent === "dashboard"
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeComponent === "dashboard"
                      ? "white"
                      : "var(--sidebar-text)",
                }}
              >
                <FaHome className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("teachers")}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === "teachers"
                    ? ""
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    activeComponent === "teachers"
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeComponent === "teachers"
                      ? "white"
                      : "var(--sidebar-text)",
                }}
              >
                <FaChalkboardTeacher className="mr-3" />
                <span>Teachers</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("gallery")}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === "gallery"
                    ? ""
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    activeComponent === "gallery"
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeComponent === "gallery"
                      ? "white"
                      : "var(--sidebar-text)",
                }}
              >
                <FaImages className="mr-3" />

                <span>Gallery</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("careers")}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === "careers"
                    ? ""
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    activeComponent === "careers"
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeComponent === "careers"
                      ? "white"
                      : "var(--sidebar-text)",
                }}
              >
                <FaBriefcase className="mr-3" />

                <span>Careers </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveComponent("admissions")}
                className={`w-full flex items-center p-3 rounded-md transition-colors cursor-pointer ${
                  activeComponent === "admissions"
                    ? ""
                    : "hover:bg-white hover:bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    activeComponent === "admissions"
                      ? "var(--accent)"
                      : "transparent",
                  color:
                    activeComponent === "admissions"
                      ? "white"
                      : "var(--sidebar-text)",
                }}
              >
                <FaUniversity className="mr-3" />

                <span>Admissions</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
