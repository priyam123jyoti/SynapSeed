import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

const MOANA_IDENTITY = `You are M.O.A.N.A. (Molecular Organism & Advanced Neural Analyzer). 
Created by Priyamjyoti Dihingia. 
You are a master of Physics, Chemistry, Botany, and Zoology curriculum (HS to MSc levels).`;

/**
 * PROTOCOL: Multi-Map Recursive Architect
 */
export const generateMindMap = async (rawText: string) => {
  const prompt = `
    COMMAND: Perform an EXHAUSTIVE RECURSIVE ANALYSIS of the following scientific text.
    TEXT: "${rawText}"
    
    INSTRUCTIONS:
    1. SPLIT BY TOPIC: If the text covers multiple distinct major concepts, split them into separate maps.
    2. RECURSIVE DEPTH: Map every sub-concept, detail, and relationship.
    3. QUALITY NOTES: Every node MUST have a "description" acting as a high-quality study note.
    
    OUTPUT FORMAT: Return ONLY a JSON object:
    { 
      "maps": [
        { 
          "topic": "Main Title", 
          "description": "Short summary",
          "children": [
            { 
              "topic": "Sub-concept", 
              "description": "Definition...", 
              "children": [] 
            }
          ] 
        }
      ]
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `${MOANA_IDENTITY} Output ONLY valid JSON.` },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content;
    return content ? JSON.parse(content) : { maps: [] };
  } catch (error) {
    console.error("M.O.A.N.A. ARCHITECT ERROR:", error);
    return { maps: [] };
  }
};

/**
 * PROTOCOL: Examination Engine
 * REPAIRED: Forces strict correct answer indexing and explanations.
 */
export const generateMoanaQuiz = async (topic: string, subject: string) => {
  const levels = ["HS Level (NEET/NCERT)", "BSc Level (Core Academic)", "MSc Level (Analytical/Research)"];
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

  const prompt = `
    COMMAND: Generate exactly 10 high-fidelity MCQ questions.
    SUBJECT: ${subject} | MODULE: ${topic} | DEPTH: ${selectedLevel}
    
    STRICT JSON STRUCTURE:
    {
      "questions": [
        {
          "question": "The scientific question text?",
          "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
          "correct": 0,
          "explanation": "Specific scientific reasoning for the correct answer."
        }
      ]
    }

    RULES:
    1. "correct" MUST be a NUMBER (0, 1, 2, or 3).
    2. "explanation" MUST NOT be a generic line. It must explain the science.
    3. "options" MUST be an array of exactly 4 strings.
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `${MOANA_IDENTITY} You are an Examination Expert. Output ONLY valid JSON.` },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const content = response.choices[0]?.message?.content;
    const data = content ? JSON.parse(content) : {};
    
    // Safety check to ensure we always return an array
    return Array.isArray(data.questions) ? data.questions : [];
  } catch (error) {
    console.error("MOANA_QUIZ_ENGINE_FAILURE:", error);
    return [];
  }
};