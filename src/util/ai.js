
// Fallback question list - used when AI generation fails
const FALLBACK_QUESTIONS = [
    "What's my favorite thing about you?",
    "Where did we first meet?",
    "What's our song?",
    "What's my favorite memory with you?",
    "What makes me smile the most?",
    "What's my favorite way to spend time with you?",
    "What's the sweetest thing you've ever done for me?",
    "What's my favorite nickname for you?",
    "What's our favorite date spot?",
    "What's the first thing I noticed about you?",
    "What's my favorite thing you cook?",
    "What's our inside joke?",
    "What's my favorite thing to do together?",
    "What's the most romantic thing you've said to me?",
    "What's my favorite quality about you?",
    "Where did we click this photo?"
];

/**
 * Generates a single romantic/Valentine's question text using AI
 * Falls back to a random predefined question if AI fails
 * @returns {Promise<string>} The generated question text
 */
export async function generateSingleQuestion() {
    try {
        // Using GPT4Free public endpoint (CORS-enabled, no API key required)
        // Using Groq endpoint which allows browser requests
        const prompt = "Generate a single romantic or Valentine's Day question for couples. Return only the question text, nothing else. Make it sweet and personal. Example: 'What's my favorite thing about you?'";
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        let response;
        try {
            response = await fetch(
                "https://g4f.space/api/groq/chat/completions",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "mixtral-8x7b-32768",
                        messages: [
                            {
                                role: "user",
                                content: prompt
                            }
                        ],
                        temperature: 0.8,
                        max_tokens: 50
                    }),
                    signal: controller.signal
                }
            );
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error("Request timeout");
            }
            throw fetchError;
        }

        if (!response || !response.ok) {
            throw new Error(`API request failed: ${response?.status || 'Unknown error'}`);
        }

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON response from API");
        }
        
        // Extract question text from OpenAI-compatible response
        let questionText = "";
        if (data.choices && data.choices.length > 0) {
            questionText = data.choices[0].message?.content?.trim() || "";
        } else if (data.message) {
            questionText = data.message.trim();
        } else if (typeof data === 'string') {
            questionText = data.trim();
        }

        // Clean up the question text
        questionText = questionText.replace(/^["']|["']$/g, '').trim();
        questionText = questionText.replace(/^Question:\s*/i, '').trim();
        questionText = questionText.replace(/^.*?question[:\s]*/i, '').trim();
        
        // Remove any markdown formatting
        questionText = questionText.replace(/^\*\*|\*\*$/g, '').trim();
        
        // Validate and return
        if (questionText && questionText.length > 10 && questionText.length < 200) {
            // Ensure it ends with a question mark
            if (!questionText.endsWith('?')) {
                questionText += '?';
            }
            return questionText;
        }
        
        // If response is invalid, fall through to fallback
        throw new Error("Invalid AI response format");
    } catch (error) {
        console.warn("AI generation failed, using fallback:", error);
        // Return a random question from the fallback list
        if (FALLBACK_QUESTIONS.length > 0) {
            const randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
            return FALLBACK_QUESTIONS[randomIndex];
        }
        // Ultimate fallback if array is somehow empty
        return "What's my favorite thing about you?";
    }
}
