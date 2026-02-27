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
 * Analyzes text and returns a series of structured mind maps.
 */
export const generateMindMap = async (rawText: string) => {
  const prompt = `
    COMMAND: Perform an EXHAUSTIVE RECURSIVE ANALYSIS of the following scientific text.
    TEXT: "${rawText}"
    
    INSTRUCTIONS:
    1. SPLIT BY TOPIC: If the text covers multiple distinct major concepts, split them into separate maps within the "maps" array.
    2. RECURSIVE DEPTH: Map every sub-concept, detail, and relationship mentioned. Go as deep as the text allows (Topic > Sub-topic > Detail > Fact).
    3. QUALITY NOTES: Every node MUST have a "description" acting as a high-quality, concise study note.
    
    OUTPUT FORMAT: Return ONLY a JSON object with this structure:
    { 
      "maps": [
        { 
          "topic": "Main Title", 
          "description": "Short summary",
          "children": [
            { 
              "topic": "Sub-concept", 
              "description": "Definition...", 
              "children": [
                { "topic": "Detail", "description": "Specific note...", "children": [] }
              ] 
            }
          ] 
        }
      ]
    }
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `${MOANA_IDENTITY} You are a Curriculum Architect. Output ONLY valid JSON.` },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Null response");
    
    return JSON.parse(content);
  } catch (error) {
    console.error("M.O.A.N.A. ARCHITECT ERROR:", error);
    return { maps: [] };
  }
};

/**
 * PROTOCOL: Examination Engine
 */
export const generateMoanaQuiz = async (topic: string, subject: string) => {
  const levels = ["HS Level (NEET/NCERT)", "BSc Level (Core Academic)", "MSc Level (Analytical/Research)"];
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

  const prompt = `
    COMMAND: Generate 10 High-Fidelity Quiz Questions.
    SUBJECT: ${subject} | MODULE: ${topic} | DEPTH: ${selectedLevel}
    Return exactly 10 questions in a JSON array inside a "questions" key.
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: `${MOANA_IDENTITY} Output ONLY valid JSON.` },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    const data = content ? JSON.parse(content) : {};
    return data.questions || [];
  } catch (error) {
    return [];
  }
};