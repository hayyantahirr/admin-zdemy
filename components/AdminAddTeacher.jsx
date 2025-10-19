"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// Modal component for adding new menu items
const AdminAddMenu = ({ isOpen, onClose }) => {
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

  // Initialize Cloudinary widget

  // Available subjects for selection
  const availableSubjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
    "PST",
    "Economics",
    "Computer Science",
    "Accounts",
    "Islamiat",
    "Urdu",
    "Add Maths",
  ];

  // Available days for schedule
  const availableDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Available time options (12-hour format with AM/PM)
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
  ];

  // Handle subject selection
  const handleSubjectSelect = (e) => {
    const selectedSubject = e.target.value;
    if (selectedSubject && !selectedSubjects.includes(selectedSubject)) {
      setSelectedSubjects([...selectedSubjects, selectedSubject]);
      e.target.value = ""; // Reset dropdown
    }
  };

  // Handle removing a subject tag
  const handleRemoveSubject = (subjectToRemove) => {
    setSelectedSubjects(
      selectedSubjects.filter((subject) => subject !== subjectToRemove)
    );
  };

  // Handle adding a new schedule entry
  const addSchedule = (day, startTime, endTime) => {
    if (day && startTime && endTime) {
      // Check if this day already has a schedule
      const existingSchedule = schedule.find((s) => s.day === day);
      if (existingSchedule) {
        setAlert({
          show: true,
          message: `Schedule for ${day} already exists. Please remove it first or choose a different day.`,
          type: "error",
        });
        return;
      }

      const newSchedule = {
        id: Date.now(), // Simple ID for tracking
        day,
        startTime,
        endTime,
      };
      setSchedule([...schedule, newSchedule]);
    }
  };

  // Handle removing a schedule entry
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if refs are valid before accessing their values
      if (
        !nameRef.current ||
        !aGradesRef.current ||
        !aStarRef.current ||
        !experienceRef.current
      ) {
        setNotification({
          show: true,
          message: "Form initialization error. Please try again.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Get values from refs
      const name = nameRef.current.value;
      const aGrades = aGradesRef.current.value;
      const aStar = aStarRef.current.value;
      const experience = experienceRef.current.value;

      // Get social media values (optional)
      const facebook = facebookRef.current?.value || "";
      const instagram = instagramRef.current?.value || "";
      const website = websiteRef.current?.value || "";

      // Validate required inputs (including image)
      if (!name || !aGrades || !aStar || !imgURL || !experience) {
        setNotification({
          show: true,
          message: "Please fill all required fields and upload an image",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Validate subjects selection
      if (selectedSubjects.length === 0) {
        setNotification({
          show: true,
          message: "Please select at least one subject",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Validate schedule (mandatory)
      if (schedule.length === 0) {
        setNotification({
          show: true,
          message: "Please add at least one schedule entry",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Create new teacher object with selected subjects
      const newTeacher = {
        name,
        aGrades,
        aStar,
        image: imgURL, // Use Cloudinary image URL
        subjects: selectedSubjects,
        schedule: schedule.map((s) => ({
          day: s.day,
          startTime: s.startTime,
          endTime: s.endTime,
        })), // Include schedule array without internal IDs
        facebook,
        instagram,
        website,
        experience,
      };

      console.log(newTeacher);
      try {
        await axios
          .post(
            "http://localhost:4000/teachersForOlevels/addTeacherForOlevels",
            newTeacher
          )
          .then((response) => {
            console.log("Teacher added successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error adding teacher:", error);
          });
      } catch {}
      // Show success notification
      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success",
      });

      // Reset form and close modal
      e.target.reset();
      setSelectedSubjects([]); // Reset subjects
      setSchedule([]); // Reset schedule
      setImgURL(""); // Reset image URL
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error);
      setNotification({
        show: true,
        message: `Error: ${error.message || "Failed to add product"}`,
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
        <h3 className="text-xl font-bold mb-4">Add New Teachers</h3>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <form onSubmit={handleSubmit}>
            {/* Item Name */}
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
                onChange={handleSubjectSelect}
                className="w-full px-3 py-2 border rounded-md"
                style={{
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                  borderColor: "var(--card-text)",
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
              <label className="block mb-2 font-medium">
                Schedule/Timings *
              </label>

              {/* Existing Schedule Entries */}
              {schedule.length > 0 && (
                <div className="mb-4 space-y-2">
                  {schedule.map((scheduleItem) => (
                    <div
                      key={scheduleItem.id}
                      className="flex items-center justify-between p-3 rounded-md border"
                      style={{
                        backgroundColor: "var(--card)",
                        borderColor: "var(--card-text)",
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-sm">
                          {scheduleItem.day}
                        </span>
                        <span className="text-sm">
                          {scheduleItem.startTime} - {scheduleItem.endTime}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSchedule(scheduleItem.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none"
                        aria-label={`Remove ${scheduleItem.day} schedule`}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Schedule Form */}
              <div
                className="border rounded-md p-4"
                style={{ borderColor: "var(--card-text)" }}
              >
                <h4 className="text-sm font-medium mb-3">Add New Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                      {availableDays
                        .filter((day) => !schedule.some((s) => s.day === day))
                        .map((day, index) => (
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

                  {/* Add Schedule Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const day =
                          document.getElementById("schedule-day").value;
                        const startTime = document.getElementById(
                          "schedule-start-time"
                        ).value;
                        const endTime =
                          document.getElementById("schedule-end-time").value;

                        if (day && startTime && endTime) {
                          addSchedule(day, startTime, endTime);
                          // Reset dropdowns
                          document.getElementById("schedule-day").value = "";
                          document.getElementById("schedule-start-time").value =
                            "";
                          document.getElementById("schedule-end-time").value =
                            "";
                        } else {
                          setAlert({
                            show: true,
                            message:
                              "Please select day, start time, and end time.",
                            type: "error",
                          });
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
              </div>
            </div>

            {/* Item Experience */}
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
            {/* Item A Grades */}
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
            {/* Item A* Grades */}
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

            {/* Item Image */}
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
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="submit"
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
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[var(--accent)] text-white"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        {/* Notification popup */}
        {notification.show && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddMenu;
