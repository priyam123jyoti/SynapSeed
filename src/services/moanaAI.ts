import Groq from "groq-sdk";

// Initialize ONLY on the server with standard non-public env variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MOANA_IDENTITY = `You are KAKU. 
Created by Priyamjyoti Dihingia. 
You are a master of Physics, Chemistry, Botany, and Zoology curriculum (HS to MSc levels).`;

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
      model: "llama-3.1-8b-instant", // UPDATED: Active Groq Model
      response_format: { type: "json_object" },
      temperature: 0.3, 
    });

    const content = response.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;

    if (parsed && parsed.map) {
      return { maps: [parsed.map] };
    }
    
    throw new Error("AI response did not match the expected mind map JSON schema.");
  } catch (error: any) {
    console.error("KAKU ARCHITECT ERROR:", error?.message || error);
    throw new Error(error?.message || "Failed to generate mind map.");
  }
};

export const generateMoanaQuiz = async (topic: string, subject: string) => {
  const prompt = `
ROLE:
You are KAKU, an expert academic examination-question generator
for Physics, Chemistry, Botany, and Zoology.

Your task is to generate a high-quality MCQ quiz using ONLY the
SUBJECT and TOPIC specified below.

============================================================
AUTHORITATIVE TARGET
============================================================

SUBJECT: ${subject}
TOPIC / MODULE: ${topic}

These values are AUTHORITATIVE.
The SUBJECT determines the academic discipline.
The TOPIC determines the exact content scope.
The TOPIC is a HARD CONTENT BOUNDARY.
It is NOT merely a suggestion or general theme.

============================================================
ACADEMIC LEVEL — STRICT BOUNDARY
============================================================

ALL questions must be appropriate for the academic range:
CLASS 11 → CLASS 12 → BSc Undergraduate → UP TO BSc FINAL SEMESTER

DO NOT generate content below Class 11 level.
DO NOT generate content above final-semester BSc level.

STRICTLY EXCLUDE:
- primary-school level material
- middle-school level material
- overly elementary questions below Class 11
- MSc-level material
- postgraduate-level material
- PhD-level material
- research-level specialist concepts
- highly specialized research methodologies
- advanced graduate-only mathematics
- obscure research literature
- highly specialized theories normally introduced after BSc
- unnecessarily advanced derivations beyond undergraduate level

============================================================
SUBJECT BOUNDARY — CRITICAL
============================================================

EVERY question MUST belong to: ${subject}
Never switch to another subject.

============================================================
TOPIC BOUNDARY — MOST IMPORTANT RULE
============================================================

Every question MUST DIRECTLY belong to: ${topic}

============================================================
QUESTION QUALITY
============================================================

Generate EXACTLY 10 high-quality MCQs.

============================================================
FINAL OUTPUT REQUIREMENTS
============================================================

Return EXACTLY 10 questions.
Return ONLY valid JSON:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option 0",
        "Option 1",
        "Option 2",
        "Option 3"
      ],
      "correct": 0,
      "explanation": "Specific scientific explanation."
    }
  ]
}
`;

  try {
    console.log("🧠 KAKU QUIZ GENERATION:", {
      subject,
      topic,
      academicRange: "Class 11 → BSc Final Semester",
    });

    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are KAKU, an expert academic examination-question generator.
Created by Priyamjyoti Dihingia.
You specialize in Physics, Chemistry, Botany, and Zoology.
The SUBJECT and TOPIC provided by the user are authoritative.
The TOPIC is a strict content boundary.
The permitted academic range is strictly: Class 11 → Class 12 → BSc Undergraduate up to Final Semester.
Never generate content below Class 11.
Never generate MSc, PhD, postgraduate, or research-level content.
Never switch subjects.
Never drift outside the requested topic.
Never knowingly generate duplicate questions.
Output ONLY valid JSON.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant", // UPDATED: Active Groq Model
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;

    console.log("🤖 KAKU RAW QUIZ RESPONSE:", content);

    const data = content ? JSON.parse(content) : {};

    if (!Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("KAKU returned invalid or empty questions format.");
    }

    return data.questions;
  } catch (error: any) {
    console.error("KAKU QUIZ ENGINE FAILURE:", error?.message || error);
    throw new Error(error?.message || "Failed to generate quiz questions via Groq.");
  }
};