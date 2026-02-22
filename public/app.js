(function () {
  "use strict";

  var API_URL = "https://remi-api.andrew-meckley1981.workers.dev";
  var isLoading = false;

  var chatArea = document.getElementById("chatArea");
  var promptInput = document.getElementById("promptInput");
  var sendBtn = document.getElementById("sendBtn");
  var micBtn = document.getElementById("micBtn");
  var speakBtn = document.getElementById("speakBtn");
  var deepDigToggle = document.getElementById("deepDigToggle");

  var isListening = false;
  var textToSpeechEnabled = false;
  var recognition = null;

  // --- Speech Recognition ---
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = function () {
      micBtn.classList.add("listening");
    };

    recognition.onend = function () {
      isListening = false;
      micBtn.classList.remove("listening");
    };

    recognition.onresult = function (event) {
      var transcript = event.results[0][0].transcript;
      promptInput.value = transcript;
      send();
    };

    recognition.onerror = function () {
      isListening = false;
      micBtn.classList.remove("listening");
      addMessage("Speech recognition failed. Please try again.", "error");
    };
  } else {
    micBtn.style.display = "none";
  }

  // --- Text-to-Speech ---
  function speakText(text) {
    if (!textToSpeechEnabled || !("speechSynthesis" in window)) return;
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  }

  // --- Event Listeners ---
  micBtn.addEventListener("click", function () {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      isListening = true;
      recognition.start();
    }
  });

  speakBtn.addEventListener("click", function () {
    textToSpeechEnabled = !textToSpeechEnabled;
    speakBtn.classList.toggle("active", textToSpeechEnabled);
    speakBtn.title = textToSpeechEnabled ? "Disable text-to-speech" : "Enable text-to-speech";
    if (!textToSpeechEnabled) {
      speechSynthesis.cancel();
    }
  });

  // Auto-resize textarea
  promptInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 120) + "px";
  });

  // Send on Enter (Shift+Enter for newline)
  promptInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  sendBtn.addEventListener("click", send);

  // --- Send ---
  function send() {
    var prompt = promptInput.value.trim();
    if (!prompt || isLoading) return;

    // Clear welcome on first send
    var welcome = chatArea.querySelector(".welcome");
    if (welcome) welcome.remove();

    addMessage(prompt, "user");

    promptInput.value = "";
    promptInput.style.height = "auto";

    isLoading = true;
    sendBtn.disabled = true;
    var loader = addTypingIndicator();

    var useDeepDig = deepDigToggle.checked;

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: prompt, useDeepDig: useDeepDig }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok || data.error) {
            throw new Error(data.error || "Failed to get response from Remi");
          }
          return data;
        });
      })
      .then(function (data) {
        loader.remove();
        addBotMessage(data.response);
        speakText(data.response);
      })
      .catch(function (err) {
        loader.remove();
        addMessage(err.message || "Something went wrong. Please try again.", "error");
      })
      .finally(function () {
        isLoading = false;
        sendBtn.disabled = false;
        promptInput.focus();
      });
  }

  // --- DOM Helpers ---
  function addMessage(text, type) {
    var msg = document.createElement("div");
    msg.className = "message " + type;
    msg.textContent = text;
    chatArea.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  function addBotMessage(text) {
    var msg = document.createElement("div");
    msg.className = "message bot";

    var label = document.createElement("div");
    label.className = "label";
    label.textContent = "Remi";
    msg.appendChild(label);

    var content = document.createElement("div");
    content.textContent = text;
    msg.appendChild(content);

    chatArea.appendChild(msg);
    scrollToBottom();
  }

  function addTypingIndicator() {
    var indicator = document.createElement("div");
    indicator.className = "typing-indicator";
    for (var i = 0; i < 3; i++) {
      indicator.appendChild(document.createElement("span"));
    }
    chatArea.appendChild(indicator);
    scrollToBottom();
    return indicator;
  }

  function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  // --- Init ---
  speakBtn.title = "Enable text-to-speech";
  if (window.innerWidth > 768) {
    promptInput.focus();
  }
})();
