import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

const MOANA_IDENTITY = `You are M.O.A.N.A. (Molecular Organism & Advanced Neural Analyzer). 
Created by Priyamjyoti Dihingia. 
You are a master of Physics, Chemistry, Botany, and Zoology curriculum (HS to MSc levels).`;

/**
 * PROTOCOL: Unified Singular Mind-Map Architect
 * REVISED: Force a single root node even for long/complex texts.
 */
export const generateMindMap = async (rawText: string) => {
  const prompt = `
    COMMAND: Perform an EXHAUSTIVE ANALYSIS of the following scientific text and synthesize it into a SINGLE UNIFIED mind map.
    TEXT: "${rawText}"
    
    INSTRUCTIONS:
    1. SINGLE ROOT: Everything must branch from ONE central master topic. DO NOT create multiple separate maps.
    2. HIERARCHICAL SYNTHESIS: If the text covers different subjects, create a broad central title and use those topics as the primary branches (first-level children).
    3. RECURSIVE DEPTH: Map every sub-concept, detail, and relationship within this single structure.
    4. QUALITY NOTES: Every node MUST have a "description" acting as a high-quality study note.
    
    OUTPUT FORMAT: Return ONLY a JSON object with this exact structure:
    { 
      "map": { 
        "topic": "Central Master Topic", 
        "description": "Comprehensive summary of all covered material",
        "children": [
          { 
            "topic": "Branch 1", 
            "description": "Notes...", 
            "children": [] 
          }
        ] 
      }
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
      temperature: 0.3, 
    });

    const content = response.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;

    // Convert the single object back into an array to maintain compatibility with your UI
    if (parsed && parsed.map) {
      return { maps: [parsed.map] };
    }
    
    return { maps: [] };
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
    
    return Array.isArray(data.questions) ? data.questions : [];
  } catch (error) {
    console.error("MOANA_QUIZ_ENGINE_FAILURE:", error);
    return [];
  }
};