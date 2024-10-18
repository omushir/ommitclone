import React from "react";

const PreviewArea = ({ children }) => {
  return (
    <div className="flex-1 p-4 border-b border-gray-200">
      <h2 className="text-xl font-bold mb-2">Preview Area</h2>
      <div className="bg-gray-100 h-full rounded relative">
        {children}
      </div>
    </div>
  );
};

export default PreviewArea;
