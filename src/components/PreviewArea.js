// Import React library
import React from "react";

// PreviewArea component definition
const PreviewArea = ({ children }) => {
  return (
    // Container div with flex-1, padding, and bottom border
    <div className="flex-1 p-4 border-b border-gray-200">
      {/* Title for the preview area */}
      <h2 className="text-xl font-bold mb-2">Preview Area</h2>
      {/* Inner container for the preview content */}
      <div className="bg-gray-100 h-full rounded relative">
        {/* Render child components passed to PreviewArea */}
        {children}
      </div>
    </div>
  );
};

// Export the PreviewArea component
export default PreviewArea;
