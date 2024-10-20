// Import React library
import React from "react";

// Define and export Icon component
export default function Icon({ name, size = 20, className = "" }) {
  return (
    // SVG element to render the icon
    <svg
      // Apply fill-current class and any additional classes
      className={`fill-current ${className}`}
      // Set width and height based on size prop
      width={size.toString() + "px"}
      height={size.toString() + "px"}
    >
      {/* Use the specified icon from the SVG sprite sheet */}
      <use xlinkHref={`/icons/solid.svg#${name}`} />
    </svg>
  );
}
