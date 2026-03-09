// =========================
// Mobile Navigation
// =========================
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =========================
// Active Nav Link
// =========================
function normalizePath(pathname) {
  if (!pathname || pathname === "/") {
    return "index.html";
  }

  const clean = pathname.split("/").pop() || "index.html";
  return clean.toLowerCase();
}

const currentPage = normalizePath(window.location.pathname);
document.querySelectorAll(".main-nav a").forEach((link) => {
  const href = (link.getAttribute("href") || "").toLowerCase();
  if (href === currentPage) {
    link.classList.add("active");
  }
});

// =========================
// Footer Year
// =========================
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// =========================
// Form Submission Demo
// =========================
document.querySelectorAll(".js-estimate-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = form.querySelector(".form-note");

    if (note) {
      note.textContent =
        "Thank you. Your estimate request was received, and our team will follow up shortly with next steps.";
    }

    form.reset();
  });
});

// =========================
// Chatbot Widget
// =========================
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotPanel = document.getElementById("chatbot-panel");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotForm = document.getElementById("chatbot-form");
const chatbotInput = document.getElementById("chatbot-input");
const quickActionButtons = document.querySelectorAll(".chatbot-quick-actions button");

const cannedReplies = {
  estimate:
    "You can request a free estimate here or on our contact page. We typically schedule consultations within 2-4 business days, then provide a clear scope and pricing path.",
  areas:
    "We serve Houston, Katy, Pearland, Sugar Land, Pasadena, and Cypress with route-based scheduling for faster response windows.",
  services:
    "We provide Landscape Design, Lawn Maintenance, Outdoor Lighting, Irrigation & Drainage, Patio & Hardscaping, plus seasonal cleanup support.",
  schedule:
    "Our team provides confirmed scheduling windows and proactive timeline updates throughout your project."
};

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function createMessageElement(text, type, timeText = getTimestamp()) {
  const element = document.createElement("div");
  element.className = `msg ${type}`;
  element.textContent = text;

  const timeElement = document.createElement("span");
  timeElement.className = "msg-time";
  timeElement.textContent = timeText;
  element.appendChild(timeElement);

  return element;
}

function addMessage(text, type) {
  if (!chatbotMessages) {
    return null;
  }

  const message = createMessageElement(text, type);
  chatbotMessages.appendChild(message);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return message;
}

function addTypingIndicator() {
  if (!chatbotMessages) {
    return null;
  }

  const typing = document.createElement("div");
  typing.className = "msg bot typing";
  typing.setAttribute("aria-hidden", "true");

  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement("span");
    dot.className = "typing-dot";
    typing.appendChild(dot);
  }

  chatbotMessages.appendChild(typing);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return typing;
}

function removeTypingIndicator(typingElement) {
  if (!typingElement || !chatbotMessages) {
    return;
  }

  chatbotMessages.removeChild(typingElement);
}

function getResponse(userText) {
  const text = userText.toLowerCase();

  if (text.includes("estimate") || text.includes("price") || text.includes("cost")) {
    return cannedReplies.estimate;
  }

  if (text.includes("area") || text.includes("houston") || text.includes("cypress")) {
    return cannedReplies.areas;
  }

  if (text.includes("service") || text.includes("offer") || text.includes("lighting")) {
    return cannedReplies.services;
  }

  if (text.includes("schedule") || text.includes("soon") || text.includes("book")) {
    return cannedReplies.schedule;
  }

  return "Great question. Share details in our estimate form and we will send tailored recommendations for your property.";
}

function sendBotReply(reply) {
  const typing = addTypingIndicator();

  window.setTimeout(() => {
    removeTypingIndicator(typing);
    addMessage(reply, "bot");
  }, 520);
}

function openChat() {
  if (!chatbotPanel || !chatbotToggle) {
    return;
  }

  chatbotPanel.classList.add("open");
  chatbotToggle.setAttribute("aria-expanded", "true");
  chatbotInput?.focus();
}

function closeChat() {
  if (!chatbotPanel || !chatbotToggle) {
    return;
  }

  chatbotPanel.classList.remove("open");
  chatbotToggle.setAttribute("aria-expanded", "false");
}

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    if (chatbotPanel.classList.contains("open")) {
      closeChat();
    } else {
      openChat();
    }
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", closeChat);
}

quickActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.question || "";
    const reply = cannedReplies[type] || cannedReplies.estimate;
    addMessage(button.textContent || "Question", "user");
    sendBotReply(reply);
  });
});

if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = chatbotInput.value.trim();

    if (!text) {
      return;
    }

    addMessage(text, "user");
    chatbotInput.value = "";
    sendBotReply(getResponse(text));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatbotPanel?.classList.contains("open")) {
    closeChat();
  }
});

document.addEventListener("click", (event) => {
  if (!chatbotPanel || !chatbotToggle) {
    return;
  }

  const clickedInsidePanel = chatbotPanel.contains(event.target);
  const clickedToggle = chatbotToggle.contains(event.target);

  if (!clickedInsidePanel && !clickedToggle && chatbotPanel.classList.contains("open")) {
    closeChat();
  }
});
