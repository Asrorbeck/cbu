// Migration utility to fix old date formats in localStorage

export const migrateDates = () => {
  try {
    // Migrate submissions
    const submissions = JSON.parse(localStorage.getItem("submissions") || "[]");

    const migratedSubmissions = submissions.map((submission) => {
      // If has old submittedDate but no submittedAt, create submittedAt
      if (submission.submittedDate && !submission.submittedAt) {
        // Try to parse old date format
        const date = parseOldDate(submission.submittedDate);
        if (date) {
          submission.submittedAt = date.toISOString();
        }
      }

      // Remove old submittedDate field
      delete submission.submittedDate;

      return submission;
    });

    localStorage.setItem("submissions", JSON.stringify(migratedSubmissions));

    // Migrate job applications
    const jobApplications = JSON.parse(
      localStorage.getItem("jobApplications") || "[]"
    );

    const migratedApplications = jobApplications.map((app) => {
      if (app.submittedDate && !app.submittedAt) {
        const date = parseOldDate(app.submittedDate);
        if (date) {
          app.submittedAt = date.toISOString();
        }
      }

      delete app.submittedDate;

      return app;
    });

    localStorage.setItem(
      "jobApplications",
      JSON.stringify(migratedApplications)
    );

    return true;
  } catch (error) {
    console.error("❌ Error during date migration:", error);
    return false;
  }
};

function parseOldDate(dateString) {
  // Try ISO format first
  let date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Try "2025 M10 15" format
  const oldFormatMatch = dateString.match(/(\d{4})\s*M(\d+)\s*(\d+)/);
  if (oldFormatMatch) {
    const [, year, month, day] = oldFormatMatch;
    date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Try "15 oktyabr 2025" format
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
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return null;
}

export default migrateDates;
