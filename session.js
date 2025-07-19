// State management
let selectedDate = 15;
let currentWeekStart = 12; // Starting day of the current week
let currentMonth = 12; // December
let currentYear = 2024;
let sessions = [
  { id: 1, status: "completed" },
  { id: 2, status: "completed" },
  { id: 3, status: "incomplete" },
  { id: 4, status: "failed" },
  { id: 5, status: "incomplete" },
];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
  renderSessions();
  updateProgress();
  updateDateHeader();

  // Event listeners
  document
    .getElementById("add-session-btn")
    .addEventListener("click", addSession);
  document
    .getElementById("prev-btn")
    .addEventListener("click", goToPreviousWeek);
  document.getElementById("next-btn").addEventListener("click", goToNextWeek);
});

function renderCalendar() {
  const calendarDates = document.getElementById("calendar-dates");
  const dates = generateWeekDates();

  calendarDates.innerHTML = "";

  dates.forEach((dateObj) => {
    const dateElement = document.createElement("div");
    dateElement.className = "calendar-date";
    dateElement.textContent = dateObj.day;

    if (
      dateObj.day === selectedDate &&
      dateObj.month === currentMonth &&
      dateObj.year === currentYear
    ) {
      dateElement.classList.add("selected");
    }

    // Add different styling for dates from different months
    if (dateObj.month !== currentMonth) {
      dateElement.style.color = "#d1d5db";
    }

    dateElement.addEventListener("click", () => {
      selectedDate = dateObj.day;
      currentMonth = dateObj.month;
      currentYear = dateObj.year;
      renderCalendar();
      updateDateHeader();
    });

    calendarDates.appendChild(dateElement);
  });
}

function generateWeekDates() {
  const dates = [];
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

  for (let i = 0; i < 7; i++) {
    const dayNumber = currentWeekStart + i;

    if (dayNumber <= 0) {
      // Previous month
      dates.push({
        day: daysInPrevMonth + dayNumber,
        month: prevMonth,
        year: prevYear,
      });
    } else if (dayNumber > daysInMonth) {
      // Next month
      dates.push({
        day: dayNumber - daysInMonth,
        month: nextMonth,
        year: nextYear,
      });
    } else {
      // Current month
      dates.push({
        day: dayNumber,
        month: currentMonth,
        year: currentYear,
      });
    }
  }

  return dates;
}

function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

function goToPreviousWeek() {
  currentWeekStart -= 7;

  // Check if we need to go to previous month
  if (currentWeekStart <= 0) {
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);

    currentWeekStart += daysInPrevMonth;
    currentMonth = prevMonth;
    currentYear = prevYear;
  }

  renderCalendar();
  updateDateHeader();
}

function goToNextWeek() {
  const daysInCurrentMonth = getDaysInMonth(currentMonth, currentYear);
  currentWeekStart += 7;

  // Check if we need to go to next month
  if (currentWeekStart > daysInCurrentMonth) {
    currentWeekStart -= daysInCurrentMonth;
    currentMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    currentYear = currentMonth === 1 ? currentYear + 1 : currentYear;
  }

  renderCalendar();
  updateDateHeader();
}

function updateDateHeader() {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dateNav = document.querySelector(".date-nav h2");
  dateNav.textContent = `${monthNames[currentMonth - 1]} ${currentYear}`;
}

function renderSessions() {
  const sessionItems = document.getElementById("session-items");
  const sessionCount = document.getElementById("session-count");

  sessionItems.innerHTML = "";
  sessionCount.textContent = `${sessions.length} total`;

  sessions.forEach((session) => {
    const sessionElement = document.createElement("div");
    sessionElement.className = `session-item ${session.status}`;

    const numberSpan = document.createElement("span");
    numberSpan.textContent = session.id;
    sessionElement.appendChild(numberSpan);

    // Add status icon
    if (session.status === "completed") {
      const statusIcon = document.createElement("span");
      statusIcon.className = "status-icon";
      statusIcon.textContent = "✓";
      sessionElement.appendChild(statusIcon);
    } else if (session.status === "failed") {
      const statusIcon = document.createElement("span");
      statusIcon.className = "status-icon";
      statusIcon.textContent = "×";
      sessionElement.appendChild(statusIcon);

      // Add remove icon
      const removeIcon = document.createElement("div");
      removeIcon.className = "remove-icon";
      removeIcon.textContent = "×";
      removeIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        removeSession(session.id);
      });
      sessionElement.appendChild(removeIcon);
    }

    sessionElement.addEventListener("click", () => {
      toggleSessionStatus(session.id);
    });

    sessionItems.appendChild(sessionElement);
  });
}

function toggleSessionStatus(id) {
  const session = sessions.find((s) => s.id === id);
  if (session) {
    if (session.status === "incomplete") {
      session.status = "completed";
    } else if (session.status === "completed") {
      session.status = "failed";
    } else if (session.status === "failed") {
      session.status = "incomplete";
    }
    renderSessions();
    updateProgress();
  }
}

function removeSession(id) {
  sessions = sessions.filter((s) => s.id !== id);
  renderSessions();
  updateProgress();
}

function addSession() {
  const newId = Math.max(...sessions.map((s) => s.id), 0) + 1;
  sessions.push({ id: newId, status: "incomplete" });
  renderSessions();
  updateProgress();
}

function updateProgress() {
  const completedSessions = sessions.filter(
    (s) => s.status === "completed"
  ).length;
  const totalSessions = sessions.length;
  const progressPercentage =
    totalSessions > 0
      ? Math.round((completedSessions / totalSessions) * 100)
      : 0;

  // Update percentage display
  document.getElementById(
    "progress-percentage"
  ).textContent = `${progressPercentage}%`;

  // Update progress circle
  const progressBar = document.getElementById("progress-bar");
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  progressBar.style.strokeDasharray = circumference;
  progressBar.style.strokeDashoffset = strokeDashoffset;
}
