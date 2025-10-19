"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

// Modal component for adding new menu items
const AdminAddGallery = ({ isOpen, onClose }) => {
  // State to show notification after form submission
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  // State to track loading during form submission
  const [isLoading, setIsLoading] = useState(false);
  // State for selected subjects (multi-select)
  const modalRef = useRef(null);
  const [imgURL, setImgURL] = useState(""); // State to store Cloudinary image URL

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

  // Handle subject selection

  // image into URL
  const myWidget = cloudinary.createUploadWidget(
    {
      cloudName: "dblnkp5ny",
      uploadPreset: "zdemy_admin",
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("Done! Here is the image info: ", result.info);
        setImgURL(result.info.secure_url);
      }
    }
  );
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if refs are valid before accessing their values
      if (!imgURL) {
        setNotification({
          show: true,
          message: "Form initialization error. Please try again.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Validate required inputs (including image)
      if (!imgURL) {
        setNotification({
          show: true,
          message: "Please fill all required fields and upload an image",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      // Create new teacher object with selected subjects
      const newGallery = {
        image: imgURL, // Use Cloudinary image URL
      };

      console.log(newGallery);
      try {
        await axios
          .post("http://localhost:4000/gallery/addGallery", newGallery)
          .then((response) => {
            console.log("Gallery added successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error adding gallery:", error);
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

export default AdminAddGallery;
