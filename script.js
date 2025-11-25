// script.js

// set year in footer (if footer exists)
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const STORAGE_KEY = "portfolioMessages";

function getMessages() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error parsing messages", e);
    return [];
  }
}

function saveMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

// RENDER TABLE (only if table exists)
function renderMessages() {
  const tbody = document.querySelector("#messagesTable tbody");
  if (!tbody) return; // admin page nahi hai

  const messages = getMessages();
  tbody.innerHTML = "";

  if (messages.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No messages yet.";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  messages.forEach((msg, index) => {
    const tr = document.createElement("tr");

    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;

    const tdName = document.createElement("td");
    tdName.textContent = msg.name;

    const tdEmail = document.createElement("td");
    tdEmail.textContent = msg.email;

    const tdMessage = document.createElement("td");
    tdMessage.textContent = msg.message;

    const tdTime = document.createElement("td");
    tdTime.textContent = msg.time;

    tr.appendChild(tdIndex);
    tr.appendChild(tdName);
    tr.appendChild(tdEmail);
    tr.appendChild(tdMessage);
    tr.appendChild(tdTime);

    tbody.appendChild(tr);
  });
}

// CONTACT FORM HANDLING (only if form exists)
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.textContent = "Please fill all fields.";
        statusEl.style.color = "#f97373";
      }
      return;
    }

    if (!email.includes("@")) {
      if (statusEl) {
        statusEl.textContent = "Enter a valid email.";
        statusEl.style.color = "#f97373";
      }
      return;
    }

    const messages = getMessages();

    const newMessage = {
      name,
      email,
      message,
      time: new Date().toLocaleString()
    };

    messages.push(newMessage);
    saveMessages(messages);

    if (statusEl) {
      statusEl.textContent =
        "Message saved. Only you can see it on admin.html (localStorage).";
      statusEl.style.color = "#4ade80";
    }

    form.reset();
  });
}

// ADMIN BUTTONS (only if on admin.html)
const reloadBtn = document.getElementById("reloadMessages");
const clearBtn = document.getElementById("clearMessages");

if (reloadBtn) {
  reloadBtn.addEventListener("click", renderMessages);
}

if (clearBtn) {
  clearBtn.addEventListener("click", function () {
    if (!confirm("Delete all stored messages?")) return;
    localStorage.removeItem(STORAGE_KEY);
    renderMessages();
  });
}

// Initial render (if admin table exists)
renderMessages();
