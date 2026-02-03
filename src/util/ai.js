
export async function getAIQuestions() {
const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
        prompt: "Generate a cute valentine quiz question with 2 options and correct answer"
      })
    });

const data = await response.json();

// Sometimes AI wraps JSON in text, so we clean it:
const raw = data.choices[0].message.content;

const jsonStart = raw.indexOf("[");
const jsonEnd = raw.lastIndexOf("]") + 1;

const clean = raw.slice(jsonStart, jsonEnd);

return JSON.parse(clean);
}