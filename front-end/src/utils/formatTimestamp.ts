const formatTimestamp = (isoString: string) => {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long", // "May" instead of "05"
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Use AM/PM instead of 24-hour clock
  });
};
export default formatTimestamp;
