document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const extractedTextDiv = document.getElementById('extractedText');
    const summaryDiv = document.getElementById('summary');
    const loadingDiv = document.getElementById('loading');
    const summarizeSection = document.getElementById('summarizeSection');
    const summarizeBtn = document.getElementById('summarizeBtn');

    let extractedText = ''; // Store extracted text globally

    // Prevent default drag and drop behavior
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight dropzone when file is dragged over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    // Handle file drop
    dropzone.addEventListener('drop', handleDrop, false);

    // Handle file input selection
    fileInput.addEventListener('change', handleFiles, false);

    // Handle summarization button click
    summarizeBtn.addEventListener('click', generateSummary);

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropzone.classList.add('dragover');
    }

    function unhighlight() {
        dropzone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(e) {
        const files = e.target ? e.target.files : e;
        if (files.length > 0) {
            processImage(files[0]);
        }
    }

    async function processImage(file) {
        // Reset previous results
        extractedTextDiv.innerHTML = '';
        summaryDiv.innerHTML = '';
        summaryDiv.classList.add('hidden');
        
        // Show loading
        loadingDiv.style.display = 'block';
        summarizeSection.classList.add('hidden');

        try {
            // Perform OCR using Tesseract.js
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => console.log(m) }
            );

            // Store extracted text
            extractedText = text;

            // Display extracted text
            extractedTextDiv.innerHTML = `<h3 class="text-xl font-semibold mb-4">Extracted Text:</h3>${text}`;
            
            // Show summarize button
            summarizeSection.classList.remove('hidden');
        } catch (error) {
            console.error('Error processing image:', error);
            extractedTextDiv.innerHTML = 'Error processing image. Please try again.';
        } finally {
            // Hide loading
            loadingDiv.style.display = 'none';
        }
    }

    function generateSummary() {
        // Reset summary
        summaryDiv.innerHTML = '';
        summaryDiv.classList.remove('hidden');

        // Show loading
        summaryDiv.innerHTML = '<p class="text-center">Generating summary...</p>';

        // Basic summarization logic
        const sentences = extractedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        // Take the first few sentences
        const summarySentences = sentences.slice(0, 3);
        
        // Join sentences and truncate if too long
        let summary = summarySentences.join('. ');
        summary = summary.length > 300 
            ? summary.substring(0, 300) + '...' 
            : summary;

        // Display summary
        summaryDiv.innerHTML = `
            <h3 class="text-xl font-semibold mb-4">Summary:</h3>
            ${summary || 'Could not generate a summary.'}
        `;
    }
});