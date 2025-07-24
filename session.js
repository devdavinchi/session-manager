// State management
let sessions = [
  { id: 1, status: "completed" },
  { id: 2, status: "completed" },
  { id: 3, status: "incomplete" },
  { id: 4, status: "failed" },
  { id: 5, status: "incomplete" },
];

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  renderSessions();
  updateProgress();
  updateDateDisplay();

  // Event listeners
  document
    .getElementById("add-session-btn")
    .addEventListener("click", addSession);
});

function updateDateDisplay() {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("current-date").textContent =
    today.toLocaleDateString("en-US", options);
}

function renderSessions() {
  const sessionItems = document.getElementById("session-items");
  const sessionCount = document.getElementById("session-count");

  sessionItems.innerHTML = "";
  sessionCount.textContent = `${sessions.length} session${
    sessions.length !== 1 ? "s" : ""
  }`;

  sessions.forEach((session) => {
    const sessionElement = document.createElement("div");
    sessionElement.className = `session-item ${session.status}`;

    // Show number for incomplete sessions, status icon for completed/failed
    if (session.status === "incomplete") {
      const numberSpan = document.createElement("span");
      numberSpan.textContent = session.id;
      sessionElement.appendChild(numberSpan);
    } else if (session.status === "completed") {
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
  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  progressBar.style.strokeDasharray = circumference;
  progressBar.style.strokeDashoffset = strokeDashoffset;
}
