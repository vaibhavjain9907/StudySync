// Server-side implementation for Gemini API integration
// This is an example using Express.js

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Get API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Endpoint to generate response from Gemini
app.post('/api/generate-response', async (req, res) => {
    try {
        const { userMessage } = req.body;

        if (!userMessage) {
            return res.status(400).json({ error: 'User message is required' });
        }

        // Generate content with Gemini
        const result = await model.generateContent({
            contents: [{
                parts: [{
                    text: `You are StudySync, an AI educational assistant. Respond to the following query from a student. Keep your answer helpful, educational, and concise (under 3 sentences unless explaining a complex concept): "${userMessage}"`
                }]
            }]
        });

        const response = result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Gemini API Key: ${GEMINI_API_KEY ? 'Configured' : 'Not configured'}`);
});

/*
 * HOW TO USE:
 * 1. Create a .env file in the same directory as this file
 * 2. Add your Gemini API key to the .env file: GEMINI_API_KEY=your_api_key_here
 * 3. Install required packages: npm install express cors dotenv @google/generative-ai
 * 4. Run the server: node server.js
 * 5. Update the chatbot.js file to use this endpoint instead of calling Gemini directly
 */
