/**
 * Format date to Uzbek locale
 * Supports multiple input formats:
 * - ISO: "2025-10-15T12:00:00.000Z"
 * - Old format: "2025 M10 15"
 * - Text format: "15 oktyabr 2025"
 *
 * @param {string} dateString - Date string in any supported format
 * @returns {string} Formatted date like "15 oktyabr 2025"
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";

  let date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    // Try to parse old format like "2025 M10 15"
    const oldFormatMatch = dateString.match(/(\d{4})\s*M(\d+)\s*(\d+)/);
    if (oldFormatMatch) {
      const [, year, month, day] = oldFormatMatch;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // Try to parse "15 oktyabr 2025" format
      const monthNames = {
        yanvar: 0,
        fevral: 1,
        mart: 2,
        aprel: 3,
        may: 4,
        iyun: 5,
        iyul: 6,
        avgust: 7,
        sentyabr: 8,
        oktyabr: 9,
        noyabr: 10,
        dekabr: 11,
      };
      const textFormatMatch = dateString.match(/(\d+)\s+(\w+)\s+(\d{4})/);
      if (textFormatMatch) {
        const [, day, monthName, year] = textFormatMatch;
        const monthIndex = monthNames[monthName.toLowerCase()];
        if (monthIndex !== undefined) {
          date = new Date(parseInt(year), monthIndex, parseInt(day));
        }
      }
    }
  }

  // Double check the date is valid after parsing
  if (isNaN(date.getTime())) {
    return dateString;
  }

  // Manual formatting for Uzbek locale
  const months = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export default formatDate;
