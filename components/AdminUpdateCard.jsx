"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const AdminUpdateCard = ({ teacher, isOpen, onClose, onTeacherUpdated }) => {
  // State to show notification after form submission
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  // State to track loading during form submission
  const [isLoading, setIsLoading] = useState(false);
  // State for selected subjects (multi-select)
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [imgURL, setImgURL] = useState(""); // State to store Cloudinary image URL
  // State for teacher schedule
  const [schedule, setSchedule] = useState([]);

  // Refs for form inputs
  const nameRef = useRef(null);
  const aGradesRef = useRef(null);
  const aStarRef = useRef(null);
  const experienceRef = useRef(null);
  // Ref for the modal to detect outside clicks
  const modalRef = useRef(null);

  // Social media refs (optional fields)
  const facebookRef = useRef(null);
  const instagramRef = useRef(null);
  const websiteRef = useRef(null);

  // Available subjects for multi-select dropdown
  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "Computer Science",
    "Economics",
    "Business Studies",
    "Accounting",
    "History",
    "Geography",
    "Psychology",
    "Sociology",
    "Art & Design",
    "Music",
    "Physical Education",
  ];

  // Available days and time options for schedule
  const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const timeOptions = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
    "5:30 PM",
    "6:00 PM",
    "6:30 PM",
    "7:00 PM",
    "7:30 PM",
    "8:00 PM",
    "8:30 PM",
    "9:00 PM",
    "9:30 PM",
    "10:00 PM",
  ];

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Pre-fill form data when teacher prop changes
  useEffect(() => {
    if (teacher) {
      // Pre-fill basic fields
      if (nameRef.current) nameRef.current.value = teacher.name || "";
      if (aGradesRef.current) aGradesRef.current.value = teacher.aGrades || "";
      if (aStarRef.current) aStarRef.current.value = teacher.aStar || "";
      if (experienceRef.current)
        experienceRef.current.value = teacher.experience || "";
      if (facebookRef.current)
        facebookRef.current.value = teacher.facebook || "";
      if (instagramRef.current)
        instagramRef.current.value = teacher.instagram || "";
      if (websiteRef.current) websiteRef.current.value = teacher.website || "";

      // Pre-fill subjects
      setSelectedSubjects(teacher.subjects || []);

      // Pre-fill image URL
      setImgURL(teacher.image || "");

      // Pre-fill schedule
      setSchedule(teacher.schedule || []);
    }
  }, [teacher]);

  // Handle adding a subject to the selected list
  const handleAddSubject = (subject) => {
    if (!selectedSubjects.includes(subject)) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  // Handle removing a subject from the selected list
  const handleRemoveSubject = (subject) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
  };

  // Add schedule function
  const addSchedule = (day, startTime, endTime) => {
    // Check if schedule for this day already exists
    const existingSchedule = schedule.find((s) => s.day === day);
    if (existingSchedule) {
      setNotification({
        show: true,
        message: `Schedule for ${day} already exists. Please remove it first.`,
        type: "error",
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    const newSchedule = {
      id: Date.now(), // Simple ID generation
      day,
      startTime,
      endTime,
    };
    setSchedule([...schedule, newSchedule]);
  };

  // Remove schedule function
  const removeSchedule = (scheduleId) => {
    setSchedule(schedule.filter((s) => s.id !== scheduleId));
  };

  // image into URL
  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: "dblnkp5ny",
      uploadPreset: "zdemy_admin",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        setImgURL(result.info.url);
      }
    }
  );

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Get form values
    const name = nameRef.current.value.trim();
    const aGrades = aGradesRef.current.value.trim();
    const aStar = aStarRef.current.value.trim();
    const experience = experienceRef.current.value.trim();
    const facebook = facebookRef.current.value.trim();
    const instagram = instagramRef.current.value.trim();
    const website = websiteRef.current.value.trim();

    // Validation
    if (!name || !aGrades || !aStar || !imgURL || !experience) {
      setNotification({
        show: true,
        message: "Please fill in all required fields and upload an image.",
        type: "error",
      });
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    if (selectedSubjects.length === 0) {
      setNotification({
        show: true,
        message: "Please select at least one subject.",
        type: "error",
      });
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    if (schedule.length === 0) {
      setNotification({
        show: true,
        message: "Please add at least one schedule entry.",
        type: "error",
      });
      setIsLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return;
    }

    try {
      // Prepare updated teacher data
      const updatedTeacher = {
        name,
        aGrades,
        aStar,
        image: imgURL, // Use Cloudinary image URL
        subjects: selectedSubjects,
        facebook: facebook || null,
        instagram: instagram || null,
        website: website || null,
        experience,
        schedule: schedule.map(({ day, startTime, endTime }) => ({
          day,
          startTime,
          endTime,
        })),
      };

      // Make PUT request to update teacher
      const response = await axios.put(
        `http://localhost:4000/teachersForOlevels/updateTeacherForOlevels/${teacher._id}`,
        updatedTeacher
      );

      if (response.status === 200) {
        setNotification({
          show: true,
          message: "Teacher updated successfully!",
          type: "success",
        });

        // Call the callback to refresh the teacher list
        onTeacherUpdated();
        onClose();
      }
    } catch (error) {
      console.error("Error updating teacher:", error);
      setNotification({
        show: true,
        message: `Error: ${error.message || "Failed to update teacher"}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // Handle delete teacher
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    setIsLoading(true);

    try {
      // Make DELETE request
      const response = await axios.delete(
        `http://localhost:4000/teachersForOlevels/deleteTeacherForOlevels/${teacher._id}`
      );

      if (response.status === 200) {
        setNotification({
          show: true,
          message: "Teacher deleted successfully!",
          type: "success",
        });

        // Call the callback to refresh the teacher list
        onTeacherUpdated();
        onClose();
      }
    } catch (error) {
      console.error("Error deleting teacher:", error);
      setNotification({
        show: true,
        message: `Error: ${error.message || "Failed to delete teacher"}`,
        type: "error",
      });
    } finally {
      setIsLoading(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: "var(--card-bg)", color: "var(--card-text)" }}
      >
        <h3 className="text-xl font-bold mb-4">Update Teacher</h3>

        {/* Notification */}
        {notification.show && (
          <div
            className={`mb-4 p-3 rounded-md ${
              notification.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleUpdate}>
            {/* Teacher Name */}
            <div className="mb-4">
              <label className="block mb-2">Teacher Name</label>
              <input
                type="text"
                ref={nameRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="Teacher's Name"
                required
              />
            </div>

            {/* Subjects Multi-Select */}
            <div className="mb-4">
              <label className="block mb-2">Subjects</label>

              {/* Selected Subjects Tags */}
              {selectedSubjects.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedSubjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "white",
                      }}
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                        aria-label={`Remove ${subject}`}
                      >
                        ❌
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Subject Selection Dropdown */}
              <select
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddSubject(e.target.value);
                    e.target.value = ""; // Reset dropdown
                  }
                }}
                defaultValue=""
              >
                <option value="">Select a subject to add</option>
                {availableSubjects
                  .filter((subject) => !selectedSubjects.includes(subject))
                  .map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
              </select>
            </div>

            {/* Schedule Section */}
            <div className="mb-4">
              <label className="block mb-2">Schedule/Timings</label>

              {/* Display existing schedules */}
              {schedule.length > 0 && (
                <div className="mb-3 space-y-2">
                  {schedule.map((scheduleItem) => (
                    <div
                      key={scheduleItem.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                      style={{
                        backgroundColor: "var(--background)",
                        borderColor: "var(--card-text)",
                      }}
                    >
                      <span className="text-sm">
                        <strong>{scheduleItem.day}:</strong>{" "}
                        {scheduleItem.startTime} - {scheduleItem.endTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSchedule(scheduleItem.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new schedule form */}
              <div
                className="border rounded-md p-3"
                style={{ borderColor: "var(--card-text)" }}
              >
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {/* Day Dropdown */}
                  <div>
                    <label className="block text-xs mb-1">Day</label>
                    <select
                      id="schedule-day"
                      className="w-full px-2 py-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--card-text)",
                      }}
                      defaultValue=""
                    >
                      <option value="">Select Day</option>
                      {availableDays.map((day, index) => (
                        <option key={index} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Start Time Dropdown */}
                  <div>
                    <label className="block text-xs mb-1">Start Time</label>
                    <select
                      id="schedule-start-time"
                      className="w-full px-2 py-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--card-text)",
                      }}
                      defaultValue=""
                    >
                      <option value="">Select Start Time</option>
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Time Dropdown */}
                  <div>
                    <label className="block text-xs mb-1">End Time</label>
                    <select
                      id="schedule-end-time"
                      className="w-full px-2 py-2 border rounded-md text-sm"
                      style={{
                        backgroundColor: "var(--background)",
                        color: "var(--foreground)",
                        borderColor: "var(--card-text)",
                      }}
                      defaultValue=""
                    >
                      <option value="">Select End Time</option>
                      {timeOptions.map((time, index) => (
                        <option key={index} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Add Schedule Button */}
                <button
                  type="button"
                  onClick={() => {
                    const day = document.getElementById("schedule-day").value;
                    const startTime = document.getElementById(
                      "schedule-start-time"
                    ).value;
                    const endTime =
                      document.getElementById("schedule-end-time").value;

                    if (day && startTime && endTime) {
                      addSchedule(day, startTime, endTime);
                      // Reset dropdowns
                      document.getElementById("schedule-day").value = "";
                      document.getElementById("schedule-start-time").value = "";
                      document.getElementById("schedule-end-time").value = "";
                    } else {
                      setNotification({
                        show: true,
                        message: "Please select day, start time, and end time.",
                        type: "error",
                      });
                      setTimeout(() => {
                        setNotification({ show: false, message: "", type: "" });
                      }, 3000);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "white",
                  }}
                >
                  Add Schedule
                </button>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <label className="block mb-2">Experience</label>
              <input
                ref={experienceRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="Experience"
                required
              />
            </div>

            {/* A Grades */}
            <div className="mb-4">
              <label className="block mb-2">A Grades</label>
              <input
                ref={aGradesRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="A Grades"
                required
              />
            </div>

            {/* A* Grades */}
            <div className="mb-4">
              <label className="block mb-2">A* Grades</label>
              <input
                ref={aStarRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="A* Grades"
                required
              />
            </div>

            {/* Social Media Links - Optional Fields */}
            <div className="mb-4">
              <label className="block mb-2">Facebook (Optional)</label>
              <input
                type="url"
                ref={facebookRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="https://facebook.com/username"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Instagram (Optional)</label>
              <input
                type="url"
                ref={instagramRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Website (Optional)</label>
              <input
                type="url"
                ref={websiteRef}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
                }}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* Image */}
            <div className="mb-6">
              <label className="block mb-2">Image</label>

              {/* Image Preview */}
              {imgURL && (
                <div className="mb-3">
                  <img
                    src={imgURL}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md border"
                    style={{
                      borderColor: "var(--card-text)",
                    }}
                  />
                </div>
              )}

              {/* Upload Button */}
              <span
                onClick={() => myWidget.open()}
                className="btn bg-[var(--accent)] text-white p-2 cursor-pointer inline-block rounded-md hover:opacity-90 transition-opacity"
              >
                {imgURL ? "Change Image" : "Upload Image"}
              </span>
            </div>

            {/* Form Actions */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md"
                style={{
                  borderColor: "var(--card-text)",
                  color: "var(--card-text)",
                }}
                disabled={isLoading}
              >
                Cancel
              </button>

              <div>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateCard;
