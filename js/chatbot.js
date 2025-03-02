const apiKey = "skproj-88Hk8E0y1pSc1Mvp53sFT9xDSuTu93gdHoGZ3BMOOioyELAyzIhOgMJSZpNo9SJ14J3IqaeGLOT3BlbkFJ9cNz0KqLntgyMyzOLPlKieMqD5siceT0tB3aTxjByPFnwo8NWL0lo2SYN0JdQwt4OME649neAA"; // ❗ DO NOT PUT YOUR API KEY HERE. Store it securely!

// ✅ Toggle Chatbot Visibility
function toggleChat() {
    let chatbotBox = document.getElementById("chatbot-box");
    chatbotBox.style.display = chatbotBox.style.display === "block" ? "none" : "block";
}

// ✅ Handle Enter Key in Input Field
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// ✅ Send Message to AI Chatbot
async function sendMessage() {
    let userInput = document.getElementById("chat-input").value;
    let chatMessages = document.getElementById("chat-messages");

    if (!userInput.trim()) return;

    // ✅ Display User Message
    let userMessage = `<div class="chat-bubble user-bubble">
        <strong>You:</strong> ${userInput}
    </div>`;
    chatMessages.innerHTML += userMessage;

    // ✅ Save message to localStorage
    saveChatHistory("You", userInput);

    // ✅ Clear Input Field
    document.getElementById("chat-input").value = "";

    // ✅ Show Typing Indicator
    let typingIndicator = `<div id="typing" class="chat-bubble ai-bubble">
        <strong>SkillBot:</strong> <i>Typing...</i>
    </div>`;
    chatMessages.innerHTML += typingIndicator;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // ✅ Call OpenAI API Securely via Backend Proxy
    let botReply = await fetchOpenAIResponse(userInput);

    // ✅ Remove Typing Indicator
    document.getElementById("typing").remove();

    // ✅ Display AI Response
    let botMessage = `<div class="chat-bubble ai-bubble">
        <strong>SkillBot:</strong> ${botReply}
    </div>`;
    chatMessages.innerHTML += botMessage;

    // ✅ Save AI response to localStorage
    saveChatHistory("SkillBot", botReply);

    // ✅ Auto-Scroll to Latest Message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ✅ Fetch AI Response from Backend Proxy (Recommended)
async function fetchOpenAIResponse(userMessage) {
    try {
        let response = await fetch("/chatbot-api", { // 🔥 Secure API call via backend
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        let data = await response.json();
        return data.reply;
    } catch (error) {
        console.error("Error fetching AI response:", error);
        return "Sorry, I couldn't fetch an answer. Please try again later.";
    }
}

// ✅ Save Chat History in LocalStorage
function saveChatHistory(sender, message) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ sender, message });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

// ✅ Load Chat History on Page Load
function loadChatHistory() {
    let chatMessages = document.getElementById("chat-messages");
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

    chatMessages.innerHTML = ""; // Clear previous messages
    chatHistory.forEach(entry => {
        let chatBubble = `<div class="chat-bubble ${entry.sender === 'You' ? 'user-bubble' : 'ai-bubble'}">
            <strong>${entry.sender}:</strong> ${entry.message}
        </div>`;
        chatMessages.innerHTML += chatBubble;
    });

    // ✅ Auto-scroll to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ✅ Run Chat History Load on Chatbot Open
document.addEventListener("DOMContentLoaded", loadChatHistory);
