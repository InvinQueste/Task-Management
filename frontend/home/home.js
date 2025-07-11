fetch("/backend/auth/authenticate.php")
  .then((res) => res.json())
  .then((data) => {
    if (!data.loggedIn) {
      window.location.href = "/login";
    } else {
      document.querySelector(".email").textContent = data.username;
    }
  })
  .catch(() => {
    alert("Failed to check login status.");
    window.location.href = "/login";
  });
let reassignTaskId = null;

function openReassignModal(taskId) {
  reassignTaskId = taskId;
  document.getElementById("newDueDate").value = "";
  document.getElementById("reassign-modal").style.display = "block";
}

function closeReassignModal() {
  document.getElementById("reassign-modal").style.display = "none";
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

  fetch("/backend/tasks/update.php", {
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
  addTaskModal.style.display = "block";
};

function closeAddTaskModal() {
  addTaskModal.style.display = "none";
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

  fetch("/backend/tasks/create.php", {
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

function loadTasks() {
  fetch("/backend/tasks/read.php")
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

      expiredBody.innerHTML = "";
      todayBody.innerHTML = "";
      upcomingBody.innerHTML = "";

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

          row.innerHTML = `
                  <td title="${task.title}">${task.title}</td>
                  <td title="${task.description || "-"}">${
            task.description || "-"
          }</td>
                  <td
                    style="${
                      task.is_completed === "0"
                        ? dueDate && dueDate < today
                          ? "color:#e53935;font-weight:bold;"
                          : dueDate === today
                          ? "color:#ff9800;font-weight:bold;"
                          : ""
                        : ""
                    }"
                  >
                    ${dueDate || "-"}
                  </td>
                    <td>
                      <span class="taskpriority ${task.priority.toLowerCase()}">
                        ${task.priority}
                      </span>
                    </td>
                    <td style="text-align:center;">
                      <div class="task-menu-container" style="display:inline-block; position:relative;">
                        <button class="task-menu-btn" onclick="toggleTaskMenu(event, ${
                          task.id
                        })" style="background:none; border:none; cursor:pointer; padding:0 6px;">
                          <span style="font-size:22px; line-height:1; color:#222">&#8942;</span>
                        </button>
                        <div class="task-menu-dropdown" id="task-menu-${
                          task.id
                        }" style="display:none; position:fixed; z-index:9999; min-width:140px;">
                          <div
                            onclick="toggleComplete(${task.id}, ${
            task.is_completed
          }); closeAllTaskMenus();"
                            class="task-menu-action"
                            style="color: ${
                              task.is_completed == 1 ? "#ff3e17" : "#0d9c00"
                            };"
                          >
                            ${
                              task.is_completed == 1
                                ? "Undo Complete"
                                : "Mark Complete"
                            }
                          </div>
                          <div onclick="deleteTask(${
                            task.id
                          }); closeAllTaskMenus();" class="task-menu-action" style="color:#e74c3c;">
                            Delete
                          </div>
                          ${
                            dueDate && dueDate < today
                              ? `<div onclick="openReassignModal(${task.id}); closeAllTaskMenus();" class="task-menu-action" style="color:#77c206;">
                                  Reassign
                                </div>`
                              : ""
                          }
                        </div>
                      </div>
                    </td>
                  `;

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
      if (expiredBody.children.length === 0) {
        if (allFiltersUnset)
          expiredBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No expired tasks</td></tr>";
        else {
          expiredBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No tasks matching filters</td></tr>";
        }
      }
      if (todayBody.children.length === 0) {
        if (allFiltersUnset)
          todayBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No tasks expiring today</td></tr>";
        else {
          todayBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No tasks matching filters</td></tr>";
        }
      }
      if (upcomingBody.children.length === 0) {
        if (allFiltersUnset)
          upcomingBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No upcoming tasks</td></tr>";
        else {
          upcomingBody.innerHTML =
            "<tr><td colspan='5' style='text-align:center'>No tasks matching filters</td></tr>";
        }
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
  fetch("/backend/tasks/update.php", {
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
      } else showNotification("Failed to update status");
    });
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    fetch("/backend/tasks/delete.php", {
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
  fetch("/backend/auth/logout.php").then(() => (location.href = "/login"));
}

function showNotification(message, type = "success") {
  const notif = document.getElementById("notification");
  notif.className = `show ${type}`;
  notif.textContent = message;

  setTimeout(() => {
    notif.className = notif.className.replace("show", "");
    setTimeout(() => {
      notif.style.display = "none";
    }, 400);
  }, 2500);

  notif.style.display = "block";
}
function showMessagePopup(message) {
  const popup = document.getElementById("message-modal");
  document.getElementById("message-modal-text").textContent = message;
  popup.style.display = "flex";
}
function closeMessagePopup() {
  document.getElementById("message-modal").style.display = "none";
}

function toggleTaskMenu(event, id) {
  event.stopPropagation();
  closeAllTaskMenus();
  const menu = document.getElementById(`task-menu-${id}`);
  const btn = event.currentTarget;
  if (menu && btn) {
    menu.style.display = "block";
    menu.style.visibility = "hidden";
    menu.style.top = "0px";
    menu.style.left = "0px";

    const btnRect = btn.getBoundingClientRect();
    const parentRect = btn.offsetParent.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;

    const top = btn.offsetTop;
    const left = btn.offsetLeft - menuWidth - 8;

    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
    menu.style.visibility = "visible";
    menu.style.zIndex = 9999;
  }
}

function closeAllTaskMenus() {
  document.querySelectorAll(".task-menu-dropdown").forEach((menu) => {
    menu.style.display = "none";
  });
}

document.addEventListener("click", closeAllTaskMenus);

const sortModal = document.getElementById("sort-modal");
const openSortModalBtn = document.getElementById("open-sort-modal");
const sortForm = document.getElementById("sort-form");

openSortModalBtn.onclick = function () {
  sortModal.style.display = "block";
};

function closeSortModal() {
  sortModal.style.display = "none";
}

sortForm.onsubmit = function (e) {
  e.preventDefault();
  closeSortModal();
  loadTasks();
};
