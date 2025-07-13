fetch("/Task-Management/backend/auth/authenticate.php")
  .then((res) => res.json())
  .then((data) => {
    if (!data.loggedIn) {
      window.location.href = "/Task-Management/login";
    } else {
      document.querySelector(".email").textContent = data.username;
    }
  })
  .catch(() => {
    alert("Failed to check login status.");
    window.location.href = "/Task-Management/login";
  });

let reassignTaskId = null;

function openReassignModal(taskId) {
  reassignTaskId = taskId;
  document.getElementById("newDueDate").value = "";
  document.getElementById("reassign-modal").classList.add("modal-visible");
}

function closeReassignModal() {
  document.getElementById("reassign-modal").classList.remove("modal-visible");
}

function submitReassign() {
  const newDate = document.getElementById("newDueDate").value;
  if (!newDate) {
    showMessagePopup("Please select a new due date.");
    return;
  }
  if (newDate < new Date().toISOString().split("T")[0]) {
    showMessagePopup("New due date cannot be in the past.");
    return;
  }
  fetch("/Task-Management/backend/tasks/update.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: reassignTaskId,
      due_date: newDate,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadTasks();
        showMessagePopup("Reassigned task successfully!");
        closeReassignModal();
      } else {
        showMessagePopup("Failed to reassign task: " + data.error);
        closeReassignModal();
      }
    });
}

document.addEventListener("DOMContentLoaded", loadTasks);
document.getElementById("titleSearch").addEventListener("input", loadTasks);
document
  .getElementById("descriptionSearch")
  .addEventListener("input", loadTasks);
document.getElementById("priorityFilter").addEventListener("change", loadTasks);
document
  .getElementById("completionFilter")
  .addEventListener("change", loadTasks);
document.getElementById("fromDate").addEventListener("change", loadTasks);
document.getElementById("toDate").addEventListener("change", loadTasks);
document.getElementById("global-sort").addEventListener("change", loadTasks);

const addTaskModal = document.getElementById("add-task-modal");
const openAddTaskBtn = document.getElementById("open-add-task-modal");
const modalTaskForm = document.getElementById("modal-task-form");

openAddTaskBtn.onclick = function () {
  addTaskModal.classList.add("modal-visible");
};

function closeAddTaskModal() {
  addTaskModal.classList.remove("modal-visible");
  modalTaskForm.reset();
}

modalTaskForm.onsubmit = function (e) {
  e.preventDefault();
  const title = document.getElementById("modal-title").value;
  const description = document.getElementById("modal-description").value;
  const dueDate = document.getElementById("modal-due_date").value;
  const priority = document.getElementById("modal-priority").value;

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (!title) {
    showMessagePopup("Title must be set");
    return;
  }
  if (!dueDate) {
    showMessagePopup("Date must be set");
    return;
  }
  if (dueDate < todayStr) {
    showMessagePopup("Date cannot be before current date");
    return;
  }

  fetch("/Task-Management/backend/tasks/create.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      due_date: dueDate,
      priority,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadTasks();
        closeAddTaskModal();
        showMessagePopup("Task added successfully!");
      } else {
        showMessagePopup(data.error || "Failed to create task");
      }
    });
};

function clearTableBody(tbody) {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

function createCell(text, classNames = []) {
  const td = document.createElement("td");
  td.textContent = text;
  if (classNames.length) td.classList.add(...classNames);
  return td;
}

function createPriorityCell(priority) {
  const td = document.createElement("td");
  const span = document.createElement("span");
  span.className = `taskpriority ${priority.toLowerCase()}`;
  span.textContent = priority;
  td.appendChild(span);
  return td;
}

function createTaskMenu(task, today) {
  const td = document.createElement("td");
  td.classList.add("centered-cell");

  const container = document.createElement("div");
  container.className = "task-menu-container";

  const btn = document.createElement("button");
  btn.className = "task-menu-btn";
  btn.setAttribute("aria-label", "Task Menu");
  btn.type = "button";
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
    closeAllTaskMenus();
    const menu = document.getElementById(`task-menu-${task.id}`);
    if (menu) {
      menu.classList.add("dropdown-visible");
    }
  });

  const icon = document.createElement("span");
  icon.className = "task-menu-icon";
  icon.textContent = "\u22EE";
  btn.appendChild(icon);

  const dropdown = document.createElement("div");
  dropdown.className = "task-menu-dropdown";
  dropdown.id = `task-menu-${task.id}`;

  const completeDiv = document.createElement("div");
  completeDiv.className = "task-menu-action";
  completeDiv.classList.add(
    task.is_completed == 1 ? "action-undo" : "action-complete"
  );
  completeDiv.textContent =
    task.is_completed == 1 ? "Undo Complete" : "Mark Complete";
  completeDiv.addEventListener("click", () => {
    toggleComplete(task.id, task.is_completed);
    closeAllTaskMenus();
  });
  dropdown.appendChild(completeDiv);

  const deleteDiv = document.createElement("div");
  deleteDiv.className = "task-menu-action action-delete";
  deleteDiv.textContent = "Delete";
  deleteDiv.addEventListener("click", () => {
    deleteTask(task.id);
    closeAllTaskMenus();
  });
  dropdown.appendChild(deleteDiv);

  if (task.due_date && task.due_date < today) {
    const reassignDiv = document.createElement("div");
    reassignDiv.className = "task-menu-action action-reassign";
    reassignDiv.textContent = "Reassign";
    reassignDiv.addEventListener("click", () => {
      openReassignModal(task.id);
      closeAllTaskMenus();
    });
    dropdown.appendChild(reassignDiv);
  }

  container.appendChild(btn);
  container.appendChild(dropdown);
  td.appendChild(container);
  return td;
}

function loadTasks() {
  fetch("/Task-Management/backend/tasks/read.php")
    .then((res) => res.json())
    .then((tasks) => {
      const search2 = document
        .getElementById("descriptionSearch")
        .value.trim()
        .toLowerCase();
      const search1 = document
        .getElementById("titleSearch")
        .value.trim()
        .toLowerCase();
      const priority = document.getElementById("priorityFilter").value;
      const completion = document.getElementById("completionFilter").value;
      const fromDate = document.getElementById("fromDate").value;
      const toDate = document.getElementById("toDate").value;
      const sortValue = document.getElementById("global-sort").value;

      if (fromDate && toDate && fromDate > toDate) {
        alert("From Date cannot be after To Date.");
        return;
      }

      const now = new Date();
      const today =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");
      const expiredBody = document.querySelector("#expired-table tbody");
      const todayBody = document.querySelector("#today-table tbody");
      const upcomingBody = document.querySelector("#upcoming-table tbody");

      clearTableBody(expiredBody);
      clearTableBody(todayBody);
      clearTableBody(upcomingBody);

      if (sortValue) {
        const [field, order] = sortValue.split("|");
        tasks.sort((a, b) => {
          let valA = a[field] || "";
          let valB = b[field] || "";
          let result = 0;
          if (field === "priority") {
            const priorityMap = { High: 3, Medium: 2, Low: 1 };
            valA = priorityMap[a.priority] || 0;
            valB = priorityMap[b.priority] || 0;
            result = order === "high" ? valB - valA : valA - valB;
          } else if (field === "due_date") {
            result =
              order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
          } else if (typeof valA === "string" && typeof valB === "string") {
            result =
              order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
          }
          if (result === 0) {
            return a.created_at.localeCompare(b.created_at);
          }
          return result;
        });
      }

      var expiredTaskCount = 0;
      var todayTaskCount = 0;
      var upcomingTaskCount = 0;
      const allFiltersUnset =
        !document.getElementById("titleSearch").value.trim() &&
        !document.getElementById("descriptionSearch").value.trim() &&
        !document.getElementById("priorityFilter").value &&
        !document.getElementById("completionFilter").value &&
        !document.getElementById("fromDate").value &&
        !document.getElementById("toDate").value;

      tasks
        .filter((task) => {
          if (search1) {
            const text = (task.title || "").toLowerCase();
            if (!text.includes(search1)) return false;
          }
          if (search2) {
            const text = (task.description || "").toLowerCase();
            if (!text.includes(search2)) return false;
          }
          if (priority && task.priority !== priority) return false;
          if (completion !== "" && String(task.is_completed) !== completion)
            return false;
          if (fromDate && (!task.due_date || task.due_date < fromDate))
            return false;
          if (toDate && (!task.due_date || task.due_date > toDate))
            return false;
          return true;
        })
        .forEach((task) => {
          const dueDate = task.due_date;
          const row = document.createElement("tr");
          if (task.is_completed === "1" || task.is_completed === 1)
            row.classList.add("completed");

          row.appendChild(createCell(task.title || "-", ["cell-title"]));
          row.appendChild(
            createCell(task.description || "-", ["cell-description"])
          );

          const dueDateCell = document.createElement("td");
          dueDateCell.textContent = dueDate || "-";
          if (task.is_completed === "0") {
            if (dueDate && dueDate < today) {
              dueDateCell.classList.add("expired-date");
            } else if (dueDate === today) {
              dueDateCell.classList.add("warning-date");
            }
          }
          row.appendChild(dueDateCell);

          row.appendChild(createPriorityCell(task.priority));
          row.appendChild(createTaskMenu(task, today));

          if (!dueDate) {
            upcomingTaskCount++;
            upcomingBody.appendChild(row);
          } else if (dueDate < today) {
            expiredTaskCount++;
            expiredBody.appendChild(row);
          } else if (dueDate === today) {
            todayTaskCount++;
            todayBody.appendChild(row);
          } else {
            upcomingTaskCount++;
            upcomingBody.appendChild(row);
          }
        });

      function appendEmptyRow(tbody, message) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 5;
        td.className = "centered-cell";
        td.textContent = message;
        tr.appendChild(td);
        tbody.appendChild(tr);
      }

      if (expiredBody.children.length === 0) {
        appendEmptyRow(
          expiredBody,
          allFiltersUnset ? "No expired tasks" : "No tasks matching filters"
        );
      }
      if (todayBody.children.length === 0) {
        appendEmptyRow(
          todayBody,
          allFiltersUnset
            ? "No tasks expiring today"
            : "No tasks matching filters"
        );
      }
      if (upcomingBody.children.length === 0) {
        appendEmptyRow(
          upcomingBody,
          allFiltersUnset ? "No upcoming tasks" : "No tasks matching filters"
        );
      }

      document.getElementById("overview-expired").textContent =
        expiredTaskCount;
      document.getElementById("overview-today").textContent = todayTaskCount;
      document.getElementById("overview-upcoming").textContent =
        upcomingTaskCount;
    });
}

function resetFilters() {
  document.getElementById("titleSearch").value = "";
  document.getElementById("descriptionSearch").value = "";
  document.getElementById("priorityFilter").value = "";
  document.getElementById("completionFilter").value = "";
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  loadTasks();
}

function resetsorts() {
  document.getElementById("global-sort").value = "";
  loadTasks();
}

function toggleComplete(id, currentStatus) {
  fetch("/Task-Management/backend/tasks/update.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      is_completed: currentStatus ? 0 : 1,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        loadTasks();
        showNotification("Task updated successfully!", "success");
      } else showNotification("Failed to update status", "error");
    });
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    fetch("/Task-Management/backend/tasks/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          loadTasks();
          showNotification("Task deleted successfully!", "success");
        } else showNotification("Failed to delete task", "error");
      });
  }
}

function logout() {
  fetch("/Task-Management/backend/auth/logout.php").then(
    () => (location.href = "/Task-Management/login")
  );
}

function showNotification(message, type = "success") {
  const notif = document.getElementById("notification");
  notif.className = `show ${type}`;
  notif.textContent = message;
  notif.style.display = "block";
  setTimeout(() => {
    notif.className = notif.className.replace("show", "");
    setTimeout(() => {
      notif.style.display = "none";
    }, 400);
  }, 2500);
}

function showMessagePopup(message) {
  const popup = document.getElementById("message-modal");
  document.getElementById("message-modal-text").textContent = message;
  popup.classList.add("modal-visible");
}

function closeMessagePopup() {
  document.getElementById("message-modal").classList.remove("modal-visible");
}

function closeAllTaskMenus() {
  document.querySelectorAll(".task-menu-dropdown").forEach((menu) => {
    menu.classList.remove("dropdown-visible");
  });
}

document.addEventListener("click", closeAllTaskMenus);

const sortModal = document.getElementById("sort-modal");
const openSortModalBtn = document.getElementById("open-sort-modal");
const sortForm = document.getElementById("sort-form");

openSortModalBtn.onclick = function () {
  sortModal.classList.add("modal-visible");
};

function closeSortModal() {
  sortModal.classList.remove("modal-visible");
}

sortForm.onsubmit = function (e) {
  e.preventDefault();
  closeSortModal();
  loadTasks();
};

document.getElementById("logout-link").addEventListener("click", logout);
document
  .getElementById("close-add-task-modal")
  .addEventListener("click", closeAddTaskModal);
document
  .getElementById("close-sort-modal")
  .addEventListener("click", closeSortModal);
document
  .getElementById("reset-sorting-btn")
  .addEventListener("click", resetsorts);
document
  .getElementById("submit-reassign-btn")
  .addEventListener("click", submitReassign);
document
  .getElementById("close-reassign-modal-btn")
  .addEventListener("click", closeReassignModal);
document
  .getElementById("close-message-modal")
  .addEventListener("click", closeMessagePopup);
document
  .getElementById("close-message-modal-btn")
  .addEventListener("click", closeMessagePopup);
