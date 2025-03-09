export const formatDate = (isoDateString: string) => {
  const date = new Date(isoDateString);

  // Step 2: Extract the components
  const day = date.getUTCDate(); // Day of the month (1-31)
  const month = date.getUTCMonth() + 1; // Month (0-11, so add 1)
  const year = date.getUTCFullYear(); // Full year (e.g., 2025)
  const hours = date.getUTCHours(); // Hours (0-23)
  const minutes = date.getUTCMinutes(); // Minutes (0-59)
  const seconds = date.getUTCSeconds(); // Seconds (0-59)

  // Step 3: Format the date and time
  const formattedDate = `${day}/${month}/${year} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return formattedDate;
};