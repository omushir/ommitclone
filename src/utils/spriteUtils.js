// Utility functions for sprite generation

// Function to get a random color for a sprite
export function getRandomColor() {
  // Array of possible colors
  const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan'];
  // Return a random color from the array
  return colors[Math.floor(Math.random() * colors.length)];
}

// Function to get a random shape for a sprite
export function getRandomShape() {
  // Array of possible shapes
  const shapes = ['triangle', 'square', 'circle', 'star'];
  // Return a random shape from the array
  return shapes[Math.floor(Math.random() * shapes.length)];
}
