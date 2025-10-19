"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./ThemeContext";
import axios from "axios";

const AdminGalleryCards = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isDeleting, setIsDeleting] = useState(null); // Track which item is being deleted

  const { theme } = useTheme();

  const fetchData = async () => {
    try {
      console.log("Attempting to fetch gallery data from API...");
      const response = await axios.get("http://localhost:4000/gallery");
      console.log("API Response:", response);
      console.log("API Data:", response.data);
      setGalleryItems(response.data.data);
    } catch (error) {
      console.log("Error fetching gallery data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle delete gallery item
  const handleDelete = async (galleryId) => {
    if (!window.confirm("Are you sure you want to delete this gallery item?")) {
      return;
    }

    setIsDeleting(galleryId);
    try {
      await axios.delete(`http://localhost:4000/gallery/deleteGallery/${galleryId}`);
      console.log("Gallery item deleted successfully");
      // Refresh the gallery list
      fetchData();
    } catch (error) {
      console.error("Error deleting gallery item:", error);
      alert("Failed to delete gallery item. Please try again.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
        theme === "light" ? "bg-white" : "bg-gray-700"
      }`}
    >
      {galleryItems && galleryItems.length > 0 ? (
        galleryItems.map((gallery) => (
          <div
            key={gallery._id}
            className={`rounded-lg shadow-lg overflow-hidden ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            {/* Image Display */}
            <div className="relative h-48">
              <Image
                src={gallery.image}
                alt="Gallery Image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            
            {/* Delete Button */}
            <div className="p-4">
              <button
                onClick={() => handleDelete(gallery._id)}
                disabled={isDeleting === gallery._id}
                className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                  isDeleting === gallery._id
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : theme === "light"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {isDeleting === gallery._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-8">
          <p
            className={theme === "light" ? "text-gray-600" : "text-gray-400"}
          >
            No gallery items found...
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminGalleryCards;
