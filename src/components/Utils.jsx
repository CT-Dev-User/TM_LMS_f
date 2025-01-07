// Utils.jsx
export const formatTitle = (title) => {
    return title
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove non-alphanumeric characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .toLowerCase();
  };
  