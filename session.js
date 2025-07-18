const currentDateDisplay = document.getElementById("current-date-display");
const prevDayBtn = document.getElementById("prev-day-btn");
const nextDayBtn = document.getElementById("next-day-btn");
const calendarRow = document.getElementById("calendar-row");
const sessionItemsContainer = document.getElementById("session-items");
const sessionCountDisplay = document.getElementById("session-count");
const progressCirclePath = document.getElementById("progress-circle-path");
const progressPercentageDisplay = document.getElementById(
  "progress-percentage"
);
const addSessionBtn = document.getElementById("add-session-btn");

let currentDate = new Date(); // Initialize with current date
let sessions = []; // Array to hold session data

const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 36; // 2 * PI * radius

// Helper to get ordinal suffix for dates
function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Function to format date for display
function formatDate(date) {
  const options = { month: "long", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options);
  const day = date.getDate();
  return `${formatted}${getOrdinalSuffix(day)}`;
}

// Render calendar row
function renderCalendarRow() {
  calendarRow.innerHTML = "";
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(
    currentDate.getDate() -
      currentDate.getDay() +
      (currentDate.getDay() === 0 ? -6 : 1)
  ); // Adjust to Monday start

  const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = daysOfWeek[i];
    calendarRow.appendChild(dayDiv);
  }

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dateDiv = document.createElement("div");
    dateDiv.className = "calendar-date";
    dateDiv.textContent = date.getDate();
    dateDiv.dataset.date = date.toISOString().split("T")[0]; // Store date string

    if (date.toDateString() === currentDate.toDateString()) {
      dateDiv.classList.add("selected");
    }

    dateDiv.addEventListener("click", () => {
      currentDate = date;
      updateUI();
    });
    calendarRow.appendChild(dateDiv);
  }
}

// Render sessions
function renderSessions() {
  sessionItemsContainer.innerHTML = "";
  sessions.forEach((session, index) => {
    const sessionDiv = document.createElement("div");
    sessionDiv.className = `session-item ${session.status}`;
    sessionDiv.dataset.id = session.id;

    const statusIcon = document.createElement("span");
    statusIcon.className = "status-icon";
    if (session.status === "completed") {
      statusIcon.textContent = "✓";
    } else if (session.status === "failed") {
      statusIcon.textContent = "×";
    }
    sessionDiv.appendChild(statusIcon);

    if (session.status === "failed") {
      const removeIcon = document.createElement("div");
      removeIcon.className = "remove-icon";
      removeIcon.textContent = "×";
      removeIcon.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent toggling status when removing
        removeSession(session.id);
      });
      sessionDiv.appendChild(removeIcon);
    }

    sessionDiv.addEventListener("click", () => toggleSessionStatus(session.id));
    sessionItemsContainer.appendChild(sessionDiv);
  });
  sessionCountDisplay.textContent = `${sessions.length} sessions`;
  updateProgressBar();
}

// Update progress bar
function updateProgressBar() {
  const completed = sessions.filter((s) => s.status === "completed").length;
  const percentage =
    sessions.length === 0 ? 0 : Math.round((completed / sessions.length) * 100);
  const offset =
    CIRCLE_CIRCUMFERENCE - (percentage / 100) * CIRCLE_CIRCUMFERENCE;

  progressCirclePath.style.strokeDasharray = CIRCLE_CIRCUMFERENCE;
  progressCirclePath.style.strokeDashoffset = offset;
  progressPercentageDisplay.textContent = `${percentage}%`;
}

// Session actions
function toggleSessionStatus(id) {
  sessions = sessions.map((session) => {
    if (session.id === id) {
      if (session.status === "incomplete") {
        return { ...session, status: "completed" };
      } else if (session.status === "completed") {
        return { ...session, status: "failed" };
      } else {
        // failed
        return { ...session, status: "incomplete" };
      }
    }
    return session;
  });
  renderSessions();
}

function addSession() {
  const newId =
    sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1;
  sessions.push({ id: newId, status: "incomplete" });
  renderSessions();
}

function removeSession(id) {
  sessions = sessions.filter((session) => session.id !== id);
  renderSessions();
}

// Update all UI elements
function updateUI() {
  currentDateDisplay.textContent = formatDate(currentDate);
  renderCalendarRow();
  // For simplicity, sessions are reset for each day. In a real app, you'd load sessions for the selected date.
  // For this demo, we'll just re-initialize with a default set.
  sessions = [
    { id: 1, status: "completed" },
    { id: 2, status: "completed" },
    { id: 3, status: "failed" },
    { id: 4, status: "completed" },
    { id: 5, status: "failed" },
  ];
  renderSessions();
}

// Event Listeners
prevDayBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateUI();
});

nextDayBtn.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateUI();
});

addSessionBtn.addEventListener("click", addSession);

// Initial render
updateUI();
