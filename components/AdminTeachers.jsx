"use client";

import React, { useState } from "react";
import AdminAddMenu from "./AdminAddTeacher";
import AdminCards from "./AdminCards";

const AdminTeachers = () => {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h2
          className="text-2xl font-bold "
          style={{ color: "var(--foreground)" }}
        >
          Teachers For Olevels
        </h2>
        <button
          className="bg-[var(--accent)] text-white px-4 py-2 rounded-md cursor-pointer hover:opacity-90"
          onClick={() => setShowModal(true)}
        >
          Add Teacher
        </button>
      </div>

      <div
        className="rounded-lg shadow p-4"
        style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
      >
        <AdminCards />
      </div>

      {/* Modal component for adding new menu items */}
      <AdminAddMenu isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default AdminTeachers;
