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

  // Refs for form inputs
  const nameRef = useRef(null);

  // Ref for the modal to detect outside clicks
  const modalRef = useRef(null);
  const aGradesRef = useRef(null);
  const aStarRef = useRef(null);

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
  // image into URL
  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: "dblnkp5ny",
      uploadPreset: "zdemy_admin",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        setImgURL(result.info.url)
      }
    }
  );
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if refs are valid before accessing their values
      if (!nameRef.current || !aGradesRef.current || !aStarRef.current) {
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

      // Get social media values (optional)
      const facebook = facebookRef.current?.value || "";
      const instagram = instagramRef.current?.value || "";
      const website = websiteRef.current?.value || "";

      // Validate required inputs (including image)
      if (!name || !aGrades || !aStar || !imgURL) {
        setNotification({
          show: true,
          message: "Please fill all required fields and upload an image",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Create new teacher object with selected subjects
      const newTeacher = {
        name,
        description,
        aGrades,
        aStar,
        image: imgURL, // Use Cloudinary image URL
        subjects: selectedSubjects,
        facebook,
        instagram,
        website,
      };

      console.log(newTeacher);

      // Simulate adding product (no actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success notification
      setNotification({
        show: true,
        message: "Product added successfully!",
        type: "success",
      });

      // Reset form and close modal
      e.target.reset();
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
