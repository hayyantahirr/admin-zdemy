"use client";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import AdminUpdateCard from "./AdminUpdateCard";
import { useTheme } from "./ThemeContext";
import axios from "axios";

const AdminCards = () => {
  const [teacherForOlevels, setTeacherForOlevels] = useState([]);
  // State for modal and selected teacher
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme } = useTheme();
  
  const fetchData = async () => {
    try {
      console.log("Attempting to fetch data from API...");
      const response = await axios.get(
        "http://localhost:4000/teachersForOlevels"
      );
      console.log("API Response:", response);
      console.log("API Data:", response.data);
      setTeacherForOlevels(response.data.data);
    } catch (error) {
      console.log("Error fetching data:", error);

      // If CORS error, it will show in network tab
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle opening the edit modal
  const handleEditClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  // Handle teacher updated (refresh data)
  const handleTeacherUpdated = () => {
    fetchData(); // Refresh the teacher list
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
          theme === "light" ? "bg-white" : "bg-gray-700"
        }`}
      >
        {teacherForOlevels ? (
          teacherForOlevels.map((teacher) => (
            <div
              key={teacher._id}
              className={`rounded-lg shadow-lg overflow-hidden ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}
            >
              <div className="relative h-50">
                <Image
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
              <div className="p-4">
                <h3
                  className={`text-lg font-bold ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  {teacher.name}
                </h3>
                <span
                  className={`text-lg font-bold ${
                    theme === "light" ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                 subjects: {teacher.subjects ? teacher.subjects.join(', ') : 'N/A'}
                </span>
                
                {/* Edit Button */}
                <div className="mt-4">
                  <button
                    onClick={() => handleEditClick(teacher)}
                    className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                      theme === "light"
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                  >
                    Edit Teacher
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p
              className={theme === "light" ? "text-gray-600" : "text-gray-400"}
            >
              Loading teachers data...
            </p>
          </div>
        )}
      </div>

      {/* AdminUpdateCard Modal */}
      {selectedTeacher && (
        <AdminUpdateCard
          teacher={selectedTeacher}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onTeacherUpdated={handleTeacherUpdated}
        />
      )}
    </>
  );
};

export default AdminCards;
