// Simple test script for Gemini API
// Run this in a browser console or with Node.js to test your API key

// Replace with your actual API key
const GEMINI_API_KEY = "YOUR_API_KEY_HERE";

// Test function using fetch API
async function testGeminiAPI() {
    console.log("Testing Gemini API connection...");

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: "Hello, please respond with a simple greeting.",
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            console.error(`Status code: ${response.status}`);

            switch (response.status) {
                case 400:
                    console.error("Bad request - Check your request format");
                    break;
                case 401:
                    console.error("Unauthorized - Your API key is invalid or missing");
                    break;
                case 403:
                    console.error("Forbidden - You don't have permission to access this resource");
                    break;
                case 404:
                    console.error("Not Found - The requested resource wasn't found");
                    break;
                case 429:
                    console.error("Too Many Requests - You've exceeded the rate limit");
                    break;
                case 500:
                case 501:
                case 502:
                case 503:
                    console.error("Server Error - Please try again later");
                    break;
            }

            return false;
        }

        const data = await response.json();
        console.log("Gemini API test successful!");
        console.log("Response:", data.candidates[0].content.parts[0].text);
        return true;
    } catch (error) {
        console.error("Error testing Gemini API:", error.message);
        return false;
    }
}

// Test function using the Google SDK (requires loading the SDK in HTML)
async function testGeminiWithSDK() {
    console.log("Testing Gemini API with Google SDK...");

    try {
        if (typeof window === 'undefined' || !window.google || !window.google.generativeAI) {
            console.error("Google Generative AI SDK not loaded. Make sure you included the script tag in your HTML.");
            return false;
        }

        const genAI = window.google.generativeAI;
        genAI.configure({ apiKey: GEMINI_API_KEY });

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello, please respond with a simple greeting.");

        console.log("Gemini SDK test successful!");
        console.log("Response:", result.response.text());
        return true;
    } catch (error) {
        console.error("Error testing Gemini with SDK:", error);
        return false;
    }
}

// Instructions for usage
console.log(`
=================================================
GEMINI API TEST SCRIPT
=================================================
1. Replace "YOUR_API_KEY_HERE" with your actual API key
2. Run this script in the browser console or Node.js
3. Check the console for test results
4. If successful, copy your API key to chatbot.js
=================================================
`);

// Automatically run the tests if in browser
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        // First try the SDK if available
        if (window.google && window.google.generativeAI) {
            testGeminiWithSDK();
        } else {
            // Fall back to fetch API
            testGeminiAPI();
        }
    });
}

// Export for Node.js
if (typeof module !== 'undefined') {
    module.exports = { testGeminiAPI };
}
