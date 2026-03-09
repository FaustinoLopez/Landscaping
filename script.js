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
// Footer Year
// =========================
const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

// =========================
// Contact Form Demo Message
// =========================
const estimateForm = document.getElementById("estimate-form");
const formNote = document.getElementById("form-note");

if (estimateForm && formNote) {
  estimateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formNote.textContent =
      "Thanks. Your request is in. Our team will contact you shortly to confirm next steps.";
    estimateForm.reset();
  });
}

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
    "Great question. We start with a free consultation, then provide a clear line-item estimate based on scope, materials, and timeline.",
  areas:
    "We currently serve Houston, Katy, Pearland, Sugar Land, Pasadena, and Cypress.",
  services:
    "We offer Landscape Design, Lawn Maintenance, Outdoor Lighting, Irrigation Systems, Patio & Hardscaping, and Seasonal Cleanup."
};

function getTimestamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function createMessageElement(text, type, timeText = getTimestamp()) {
  const messageElement = document.createElement("div");
  messageElement.className = `msg ${type}`;
  messageElement.textContent = text;

  const timeElement = document.createElement("span");
  timeElement.className = "msg-time";
  timeElement.textContent = timeText;
  messageElement.appendChild(timeElement);

  return messageElement;
}

function addMessage(text, type) {
  if (!chatbotMessages) {
    return null;
  }

  const messageElement = createMessageElement(text, type);
  chatbotMessages.appendChild(messageElement);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return messageElement;
}

function addTypingIndicator() {
  if (!chatbotMessages) {
    return null;
  }

  const typingElement = document.createElement("div");
  typingElement.className = "msg bot typing";
  typingElement.setAttribute("aria-hidden", "true");

  for (let i = 0; i < 3; i += 1) {
    const dot = document.createElement("span");
    dot.className = "typing-dot";
    typingElement.appendChild(dot);
  }

  chatbotMessages.appendChild(typingElement);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  return typingElement;
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

  if (text.includes("area") || text.includes("houston")) {
    return cannedReplies.areas;
  }

  if (text.includes("service") || text.includes("offer")) {
    return cannedReplies.services;
  }

  if (text.includes("schedule") || text.includes("soon") || text.includes("book")) {
    return "Most consultations are booked within 2-4 business days, and project start dates depend on scope and current queue.";
  }

  return "Happy to help. For exact pricing and timeline recommendations, submit the estimate form and our team will follow up with tailored options.";
}

function sendBotReply(reply) {
  const typingElement = addTypingIndicator();

  window.setTimeout(() => {
    removeTypingIndicator(typingElement);
    addMessage(reply, "bot");
  }, 550);
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

if (chatbotToggle) {
  chatbotToggle.addEventListener("click", () => {
    if (!chatbotPanel?.classList.contains("open")) {
      openChat();
    } else {
      closeChat();
    }
  });
}

if (chatbotClose) {
  chatbotClose.addEventListener("click", closeChat);
}

quickActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const questionType = button.dataset.question || "";
    const reply = cannedReplies[questionType] || cannedReplies.estimate;
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
