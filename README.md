# StudySync with Gemini AI Integration

This project is a comprehensive academic support platform with an integrated AI-powered chatbot using Google's Gemini API.

## Features

- Responsive web design for all device sizes
- AI-powered chatbot for answering academic questions
- Support for various subjects (math, science, history, etc.)
- Real-time typing indicators for a natural chat experience
- Toggle between basic responses and advanced Gemini AI

## Setup Instructions

### Client-Side Only Setup

For a simple client-side only setup (not recommended for production):

1. Get a Gemini API key from [Google AI Studio](https://ai.google.dev/)
2. Open `js/chatbot.js` and replace the placeholder API key:
   ```javascript
   const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
   ```
3. Open `index.html` in a web browser

Note: The client-side only approach exposes your API key in the frontend code, which is not secure for production environments.

### Secure Server-Side Setup (Recommended)

For a secure setup that protects your API key:

1. Install Node.js and npm if not already installed
2. Navigate to the project directory in terminal
3. Install required dependencies:
   ```bash
   npm install express cors dotenv @google/generative-ai
   ```
4. Create a `.env` file based on the `.env.example` template:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
5. Start the server:
   ```bash
   node server.js
   ```
6. Open `http://localhost:3000` in your web browser

## Configuration Options

You can adjust the chatbot behavior by modifying the configuration in `js/chatbot.js`:

```javascript
const config = {
    useServerEndpoint: true, // Use the server endpoint for API calls
    useClientLibrary: true,  // Use Google's client library when available
    fallbackToDirectApi: true // Fall back to direct API calls if needed
};
```

## Troubleshooting

- If the chatbot fails to connect to Gemini, it will automatically fall back to basic responses
- Check your browser console for detailed error messages
- Ensure your API key is valid and has not reached its quota limit
- For server-side setup, make sure the server is running and accessible

## License

This project is released under the MIT License.

## Credits

- Google Gemini API for AI capabilities
- Font Awesome for icons
- Various open-source libraries and frameworks
