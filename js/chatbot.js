document.addEventListener('DOMContentLoaded', () => {
    // Chat elements
    const chatToggleBtn = document.getElementById('chatBotToggle');
    const chatInterface = document.getElementById('chatBotInterface');
    const closeChat = document.getElementById('closeChat');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessage = document.getElementById('sendMessage');
    const geminiToggle = document.getElementById('geminiToggle');
    const geminiIndicator = document.querySelector('.gemini-badge');

    // Gemini API setup - Replace with your actual API key
    const GEMINI_API_KEY = "YOUR_API_KEY_HERE"; // Replace this with your actual Gemini API key
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

    // Configuration options
    const config = {
        useClientLibrary: true,  // Use Google's client library if available
        fallbackToDirectApi: true // Fall back to direct API calls if client library fails
    };

    // Model initialization
    let model = null;
    let genAI = null;

    // Try to initialize the Gemini model with Google's client library
    const initializeGeminiModel = async () => {
        try {
            if (typeof window.google !== 'undefined' && window.google.generativeAI && config.useClientLibrary) {
                // Initialize with Google's official client library
                genAI = window.google.generativeAI;
                genAI.configure({ apiKey: GEMINI_API_KEY });
                model = genAI.getGenerativeModel({ model: "gemini-pro" });

                // Test the model with a simple prompt
                const result = await model.generateContent("Hello");
                console.log("Gemini model initialized and tested successfully");
                return true;
            } else {
                console.warn("Google Gemini client library not available. Will use fetch API instead.");
                return false;
            }
        } catch (error) {
            console.error("Error initializing Gemini model:", error);
            return false;
        }
    };

    // Initialize the model on page load
    const initialize = async () => {
        await initializeGeminiModel();
        if (!model && config.fallbackToDirectApi) {
            // If model initialization failed, attempt a test API call
            testGeminiAPI();
        }
    };

    // Test the Gemini API connection with a simple request
    const testGeminiAPI = async () => {
        try {
            showTypingIndicator();
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: "Hello"
                        }]
                    }]
                })
            });

            removeTypingIndicator();
            if (response.ok) {
                console.log("Direct Gemini API connection test successful");
                return true;
            } else {
                console.error(`Gemini API connection error: ${response.status}`);
                isGeminiEnabled = false;
                updateGeminiUI();
                return false;
            }
        } catch (error) {
            console.error("Gemini API test failed:", error);
            removeTypingIndicator();
            isGeminiEnabled = false;
            updateGeminiUI();
            return false;
        }
    };

    initialize();

    let isGeminiEnabled = true; // Toggle between basic responses and Gemini
    let isAwaitingGeminiResponse = false;

    // Set initial state of Gemini toggle button
    updateGeminiUI();

    // Sample responses for different topics
    const responses = {
        "greeting": [
            "Hello! How can I help with your studies today?",
            "Hi there! What subject are you working on?",
            "Welcome to StudySync! How can I assist you with your academic needs?"
        ],
        "math": [
            "For math problems, I can help explain concepts, solve equations, and provide step-by-step solutions. What specific math topic are you working on?",
            "Math can be challenging! I can help with algebra, calculus, geometry, statistics, and more. What do you need help with?",
            "I'm ready to help with your math questions. Could you share the specific problem you're working on?"
        ],
        "science": [
            "I can help explain scientific concepts, formulas, and theories. What specific area of science are you studying?",
            "For science topics, I can provide explanations, examples, and diagrams. What science subject are you working on?",
            "Science is fascinating! I can help with biology, chemistry, physics, and more. What questions do you have?"
        ],
        "history": [
            "I can help with historical events, timelines, figures, and contexts. What period of history are you studying?",
            "History is full of fascinating stories! I can help with dates, events, and explaining historical significance. What topic are you researching?",
            "For history, I can provide timelines, explain events, and help you understand the context. What historical period are you focused on?"
        ],
        "english": [
            "I can help with essays, grammar, literature analysis, and writing techniques. What specific English assignment are you working on?",
            "For English, I can assist with essay structure, literary analysis, grammar rules, and more. What do you need help with?",
            "Whether it's writing, grammar, or literature, I can help improve your English skills. What specific area are you focusing on?"
        ],
        "default": [
            "I'm here to help with any academic questions. Could you provide more details about what you're working on?",
            "I'd be happy to assist with your studies. Can you tell me more about what you're learning?",
            "I can help with various subjects including math, science, history, English, and more. What subject are you studying?"
        ]
    };

    // Show chat interface when chat button is clicked
    chatToggleBtn.addEventListener('click', () => {
        chatInterface.style.display = 'flex';
        chatToggleBtn.style.display = 'none';
        chatInput.focus();

        // Add welcome message with Gemini status
        if (chatMessages.children.length === 1) {
            const geminiStatusMessage = isGeminiEnabled ?
                "I'm powered by Google Gemini AI to provide more accurate and helpful responses!" :
                "I'm currently using basic responses. Type 'enable gemini' to activate advanced AI.";

            setTimeout(() => {
                addMessage("By the way, " + geminiStatusMessage);
            }, 1000);
        }
    });

    // Hide chat interface when close button is clicked
    closeChat.addEventListener('click', () => {
        chatInterface.style.display = 'none';
        chatToggleBtn.style.display = 'flex';
    });

    // Toggle Gemini on/off when toggle button is clicked
    geminiToggle.addEventListener('click', () => {
        isGeminiEnabled = !isGeminiEnabled;
        updateGeminiUI();

        const statusMessage = isGeminiEnabled ?
            "Gemini AI is now enabled! I'll provide more advanced responses to your questions." :
            "Gemini AI is now disabled. I'll use my basic response system.";

        addMessage(statusMessage);

        // If enabling Gemini, try to initialize the model again if needed
        if (isGeminiEnabled && !model && config.useClientLibrary) {
            initializeGeminiModel();
        }
    });

    // Update UI based on Gemini status
    function updateGeminiUI() {
        if (isGeminiEnabled) {
            geminiToggle.classList.add('active');
            geminiIndicator.style.display = 'inline';
        } else {
            geminiToggle.classList.remove('active');
            geminiIndicator.style.display = 'none';
        }
    }

    // Function to add a message to the chat
    function addMessage(text, isUser = false, isGeminiResponse = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

        if (!isUser && isGeminiEnabled && isGeminiResponse) {
            messageDiv.classList.add('gemini-response');
        }

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator');
        typingDiv.id = 'typingIndicator';

        const dots = document.createElement('div');
        dots.classList.add('typing-dots');
        dots.innerHTML = '<span></span><span></span><span></span>';

        typingDiv.appendChild(dots);
        chatMessages.appendChild(typingDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Function to get a response from Gemini
    async function getGeminiResponse(userMessage) {
        try {
            showTypingIndicator();

            // Format prompt with system instructions
            const formattedPrompt = "*You are StudySync, an AI educational assistant. Be helpful, educational, and concise.*\n\n" + userMessage;

            // Try to use the Gemini model with client library first
            if (model && config.useClientLibrary) {
                try {
                    const result = await model.generateContent(formattedPrompt);

                    removeTypingIndicator();

                    // Check for and handle different response formats
                    if (result && result.response) {
                        if (typeof result.response.text === 'function') {
                            return result.response.text();
                        } else if (result.response.text) {
                            return result.response.text;
                        }
                    }
                } catch (modelError) {
                    console.error("Error using Gemini model directly:", modelError);
                    // Fall back to fetch API if configured and there was an error
                    if (!config.fallbackToDirectApi) {
                        throw modelError;
                    }
                }
            }

            // Fallback to direct fetch API if client library failed or isn't available
            if (config.fallbackToDirectApi) {
                const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: formattedPrompt
                            }]
                        }]
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Gemini API error:", errorData);

                    // Handle specific error cases
                    if (response.status === 429) {
                        throw new Error('Rate limit exceeded. Please try again later.');
                    } else {
                        throw new Error(`Gemini API error: ${response.status}`);
                    }
                }

                const data = await response.json();
                removeTypingIndicator();

                if (data.candidates && data.candidates[0] && data.candidates[0].content &&
                    data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    throw new Error('Unexpected response format from Gemini API');
                }
            } else {
                throw new Error('All Gemini API access methods failed');
            }
        } catch (error) {
            console.error('Error with Gemini API:', error);
            removeTypingIndicator();

            // Only disable Gemini for critical errors, not for all errors
            if (error.message.includes('API key') || error.message.includes('unauthorized')) {
                isGeminiEnabled = false;
                updateGeminiUI();
                return "I couldn't connect to my advanced AI capabilities due to an authentication issue. I'll use my basic responses instead. " + getRandomResponse('default');
            }

            return "Sorry, I couldn't generate a response with Gemini right now. " + getRandomResponse('default');
        }
    }

    // Function to get a response based on the user's message
    function getBotResponse(userMessage) {
        userMessage = userMessage.toLowerCase();

        // Check for Gemini commands
        if (userMessage.includes('enable gemini')) {
            isGeminiEnabled = true;
            updateGeminiUI();
            // Try to initialize model again if it was null
            if (!model && config.useClientLibrary) {
                initializeGeminiModel();
            }
            return "Gemini AI is now enabled! I'll provide more advanced responses to your questions.";
        } else if (userMessage.includes('disable gemini')) {
            isGeminiEnabled = false;
            updateGeminiUI();
            return "Gemini AI is now disabled. I'll use my basic response system.";
        } else if (userMessage.includes('fix gemini') || userMessage.includes('repair gemini')) {
            // Add a troubleshooting option
            isGeminiEnabled = true;
            updateGeminiUI();
            initialize(); // Re-initialize the model
            return "I'm attempting to reconnect to Gemini AI. Please try asking a question in a moment.";
        }

        // Check for different topics if not using Gemini
        if (!isGeminiEnabled) {
            if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
                return getRandomResponse('greeting');
            } else if (userMessage.includes('math') || userMessage.includes('algebra') || userMessage.includes('calculus') ||
                userMessage.includes('equation') || userMessage.includes('geometry') || userMessage.includes('statistics')) {
                return getRandomResponse('math');
            } else if (userMessage.includes('science') || userMessage.includes('biology') || userMessage.includes('chemistry') ||
                userMessage.includes('physics') || userMessage.includes('experiment')) {
                return getRandomResponse('science');
            } else if (userMessage.includes('history') || userMessage.includes('historical') || userMessage.includes('ancient') ||
                userMessage.includes('war') || userMessage.includes('civilization')) {
                return getRandomResponse('history');
            } else if (userMessage.includes('english') || userMessage.includes('essay') || userMessage.includes('grammar') ||
                userMessage.includes('writing') || userMessage.includes('literature')) {
                return getRandomResponse('english');
            } else {
                return getRandomResponse('default');
            }
        }

        // Using Gemini for more advanced responses
        return null; // This will trigger the async Gemini flow
    }

    // Get a random response from a category
    function getRandomResponse(category) {
        const categoryResponses = responses[category] || responses.default;
        const randomIndex = Math.floor(Math.random() * categoryResponses.length);
        return categoryResponses[randomIndex];
    }

    // Send message when send button is clicked
    sendMessage.addEventListener('click', () => {
        sendUserMessage();
    });

    // Send message when Enter key is pressed in the input field
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Function to handle sending user messages
    async function sendUserMessage() {
        const userMessage = chatInput.value.trim();

        if (userMessage && !isAwaitingGeminiResponse) {
            // Add user message to chat
            addMessage(userMessage, true);

            // Clear input field
            chatInput.value = '';

            // Get response based on user message
            const botResponse = getBotResponse(userMessage);

            if (botResponse) {
                // For simple responses or when Gemini is disabled
                setTimeout(() => {
                    addMessage(botResponse);
                }, 500);
            } else if (isGeminiEnabled) {
                // For Gemini-powered responses
                isAwaitingGeminiResponse = true;
                try {
                    const geminiResponse = await getGeminiResponse(userMessage);
                    addMessage(geminiResponse, false, true);
                } catch (error) {
                    addMessage("Sorry, I couldn't generate a response. " + getRandomResponse('default'));
                }
                isAwaitingGeminiResponse = false;
            }
        }
    }
});
