/**
 * Homework Solution Feature
 * Handles file uploads, tab switching, and getting homework solutions
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const homeworkBtn = document.getElementById('homeworkBtn');
    const homeworkModal = document.getElementById('homeworkModal');
    const closeModalBtn = document.getElementById('closeHomeworkModal');
    const tabs = document.querySelectorAll('.homework-tab');
    const tabContents = document.querySelectorAll('.homework-tab-content');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('homeworkFile');
    const previewArea = document.getElementById('previewArea');
    const homeworkPreview = document.getElementById('homeworkPreview');
    const removeImageBtn = document.getElementById('removeImage');
    const scanHomeworkBtn = document.getElementById('scanHomework');
    const subjectSelect = document.getElementById('subjectSelect');
    const questionText = document.getElementById('questionText');
    const submitQuestionBtn = document.getElementById('submitQuestion');
    const homeworkSolution = document.getElementById('homeworkSolution');
    const solutionContent = document.getElementById('solutionContent');
    const solutionLoading = document.getElementById('solutionLoading');

    // Open and close modal
    homeworkBtn.addEventListener('click', () => {
        homeworkModal.style.display = 'flex';
        setTimeout(() => {
            homeworkModal.classList.add('active');
        }, 10);
    });

    closeModalBtn.addEventListener('click', closeModal);

    function closeModal() {
        homeworkModal.classList.remove('active');
        setTimeout(() => {
            homeworkModal.style.display = 'none';
            // Reset the form
            resetForm();
        }, 300);
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const tabId = tab.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId + 'Tab').classList.add('active');

            // Reset solution area when switching tabs
            hideSolution();
        });
    });

    // File upload handling
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');

        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    // Handle file upload
    function handleFile(file) {
        // Check if file is an image
        if (!file.type.match('image.*')) {
            alert('Please upload an image file (jpg, png, etc.)');
            return;
        }

        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            homeworkPreview.src = e.target.result;
            previewArea.style.display = 'block';
            scanHomeworkBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }

    // Remove image
    removeImageBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewArea.style.display = 'none';
        scanHomeworkBtn.disabled = true;
    });

    // Handle scan homework button
    scanHomeworkBtn.addEventListener('click', () => {
        if (previewArea.style.display !== 'none') {
            getHomeworkSolution('scan');
        } else {
            alert('Please upload an image of your homework first');
        }
    });

    // Handle submit question button
    submitQuestionBtn.addEventListener('click', () => {
        if (subjectSelect.value && questionText.value) {
            getHomeworkSolution('manual');
        } else {
            alert('Please select a subject and enter your question');
        }
    });

    // Get homework solution
    async function getHomeworkSolution(type) {
        showLoading();

        try {
            let prompt, subject, question;

            if (type === 'scan') {
                // In a production app, you would upload the image to a server
                // Here we're simulating with text
                prompt = "Please solve this homework problem (from uploaded image)";

                // For demo purposes only - in real application you would
                // use OCR to extract text from the image or send the image directly
                // to a model that can process images
            } else {
                subject = subjectSelect.value;
                question = questionText.value;
                prompt = `Please solve this ${subject} homework problem: ${question}`;
            }

            // Try to use the chatbot's API for consistency
            let response;
            try {
                // Assuming getGeminiResponse is a function from chatbot.js
                if (typeof getGeminiResponse === 'function') {
                    response = await getGeminiResponse(prompt);
                }
            } catch (error) {
                console.log('Error using Gemini API, using fallback response', error);
                response = null;
            }

            // If gemini is not available, use a fallback solution
            if (!response) {
                // Simplified fallback response based on subject
                let fallbackResponse;

                if (type === 'manual') {
                    switch (subject.toLowerCase()) {
                        case 'math':
                            fallbackResponse = "This is a math problem solution. I would recommend solving step by step using the relevant formulas and checking your work.";
                            break;
                        case 'physics':
                            fallbackResponse = "For this physics question, consider the physical laws involved such as Newton's laws or conservation principles and how they apply to this specific scenario.";
                            break;
                        case 'chemistry':
                            fallbackResponse = "When addressing chemistry problems, identify the relevant chemical reactions, balance the equations, and consider factors like stoichiometry or equilibrium.";
                            break;
                        case 'biology':
                            fallbackResponse = "For biology questions, consider the relevant biological processes, structures, or systems involved and how they function together.";
                            break;
                        case 'history':
                            fallbackResponse = "When addressing history questions, remember to consider the context, key figures, and the timeline of events relevant to this topic.";
                            break;
                        case 'english':
                            fallbackResponse = "For literary analysis, examine the themes, characters, symbolism, and historical context of the work in question.";
                            break;
                        default:
                            fallbackResponse = "To solve this problem, break it down into smaller parts and tackle each one systematically. Refer to your textbook and notes for guidance.";
                    }
                } else {
                    fallbackResponse = "Based on your uploaded homework image, I recommend reviewing the relevant chapter in your textbook and applying the concepts you've learned in class.";
                }

                showSolution(fallbackResponse);
            } else {
                showSolution(response);
            }

        } catch (error) {
            console.error('Error getting homework solution:', error);
            showSolution('Sorry, I encountered an error while processing your homework. Please try again later.');
        }
    }

    // UI Helper functions
    function showLoading() {
        homeworkSolution.style.display = 'block';
        solutionLoading.style.display = 'block';
        solutionContent.style.display = 'none';
    }

    function showSolution(text) {
        solutionLoading.style.display = 'none';
        solutionContent.style.display = 'block';
        solutionContent.textContent = text;
    }

    function hideSolution() {
        homeworkSolution.style.display = 'none';
    }

    function resetForm() {
        // Reset file upload
        fileInput.value = '';
        previewArea.style.display = 'none';
        scanHomeworkBtn.disabled = true;

        // Reset manual input
        subjectSelect.selectedIndex = 0;
        questionText.value = '';

        // Hide solution
        hideSolution();

        // Reset to first tab
        tabs[0].click();
    }

    // Keyboard event to close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && homeworkModal.style.display === 'flex') {
            closeModal();
        }
    });

    // Close modal when clicking outside of content
    homeworkModal.addEventListener('click', (e) => {
        if (e.target === homeworkModal) {
            closeModal();
        }
    });
});
