import Groq from "groq-sdk";

// ============================================================
// GROQ CONFIGURATION
// ============================================================

// Initialize ONLY on the server.
// Never expose GROQ_API_KEY through NEXT_PUBLIC_*
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Current Groq production model.
// Replaces the retired "openai/gpt-oss-20b" model.
const KAKU_MODEL = "openai/gpt-oss-20b";

// ============================================================
// KAKU IDENTITY
// ============================================================

const KAKU_IDENTITY = `
You are KAKU.

Created by Priyamjyoti Dihingia.

You are an expert academic AI specializing in:
- Physics
- Chemistry
- Botany
- Zoology

You generate academically accurate educational content.
`;

// ============================================================
// MIND MAP GENERATOR
// ============================================================

export const generateMindMap = async (rawText: string) => {
  const prompt = `
COMMAND:
Perform an EXHAUSTIVE ANALYSIS of the following scientific text
and synthesize it into a SINGLE UNIFIED mind map.

TEXT:
"${rawText}"

============================================================
MIND MAP RULES
============================================================

1. SINGLE ROOT
Everything must branch from ONE central master topic.

DO NOT create multiple separate maps.

2. HIERARCHICAL SYNTHESIS
If the text covers different subjects or areas, create one
broad central title and use those topics as the primary
branches.

3. RECURSIVE DEPTH
Map every important:
- concept
- sub-concept
- definition
- process
- mechanism
- classification
- relationship
- scientific detail

into the hierarchy.

4. QUALITY NOTES
Every node MUST contain a useful academic "description".

Descriptions should function as high-quality study notes.

5. DO NOT INVENT INFORMATION
Use the supplied scientific text as the primary source.
Do not introduce unrelated concepts.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY a JSON object.

The JSON MUST follow this structure:

{
  "map": {
    "topic": "Central Master Topic",
    "description": "Comprehensive summary of all covered material",
    "children": [
      {
        "topic": "Branch 1",
        "description": "Detailed study notes",
        "children": []
      }
    ]
  }
}

Do not include:
- Markdown
- code fences
- explanations outside JSON
- comments
- additional top-level properties
`;

  try {
    console.log("🧠 KAKU MIND MAP REQUEST", {
      model: KAKU_MODEL,
      inputLength: rawText.length,
    });

    const response = await groq.chat.completions.create({
      model: KAKU_MODEL,

      messages: [
        {
          role: "system",
          content: `${KAKU_IDENTITY}

You are generating structured educational data.

Output ONLY valid JSON.
Do not output Markdown.
Do not output commentary outside JSON.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      // GPT-OSS supports JSON Object Mode.
      response_format: {
        type: "json_object",
      },

      // Prevent reasoning text from being mixed into the JSON response.
      reasoning_format: "hidden",

      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content;

    console.log("🤖 KAKU MIND MAP RESPONSE RECEIVED");

    if (!content) {
      throw new Error("Groq returned an empty response.");
    }

    const parsed = JSON.parse(content);

    if (!parsed?.map) {
      throw new Error(
        "Groq returned JSON, but the required 'map' object is missing."
      );
    }

    return {
      maps: [parsed.map],
    };
  } catch (error: any) {
    console.error("❌ KAKU MIND MAP ENGINE FAILURE:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type,
    });

    throw new Error(
      error?.message || "Failed to generate mind map via Groq."
    );
  }
};

// ============================================================
// KAKU QUIZ GENERATOR
// ============================================================

export const generateMoanaQuiz = async (
  topic: string,
  subject: string
) => {
  const prompt = `
ROLE:
You are KAKU, an expert academic examination-question generator
for Physics, Chemistry, Botany, and Zoology.

============================================================
AUTHORITATIVE TARGET
============================================================

SUBJECT:
${subject}

TOPIC / MODULE:
${topic}

These values are AUTHORITATIVE.

The SUBJECT determines the academic discipline.

The TOPIC determines the exact content scope.

The TOPIC is a HARD CONTENT BOUNDARY.

It is NOT merely a suggestion or general theme.

============================================================
ACADEMIC LEVEL — STRICT BOUNDARY
============================================================

ALL questions must be appropriate for:

CLASS 11
→ CLASS 12
→ BSc UNDERGRADUATE
→ UP TO BSc FINAL SEMESTER

DO NOT generate content below Class 11 level.

DO NOT generate content above final-semester BSc level.

STRICTLY EXCLUDE:

- Primary-school material
- Middle-school material
- Elementary questions below Class 11
- MSc-level material
- Postgraduate-level material
- PhD-level material
- Research-level specialist concepts
- Highly specialized research methodologies
- Graduate-only mathematics
- Obscure research literature
- Highly specialized theories normally introduced after BSc
- Advanced derivations beyond normal BSc curriculum

============================================================
SUBJECT BOUNDARY — CRITICAL
============================================================

EVERY question MUST belong to:

${subject}

NEVER switch to another subject.

============================================================
TOPIC BOUNDARY — MOST IMPORTANT
============================================================

EVERY question MUST directly belong to:

${topic}

Do not drift into unrelated chapters.

Do not use another topic merely because it is related.

============================================================
QUESTION QUALITY
============================================================

Generate EXACTLY 10 high-quality MCQs.

Questions should test a mixture of:

- Conceptual understanding
- Scientific reasoning
- Application
- Interpretation
- Important facts
- Mechanisms
- Processes
- Classification where relevant

Avoid unnecessarily trivial questions.

Avoid obscure research-level questions.

Avoid duplicate questions.

============================================================
FINAL OUTPUT
============================================================

Return ONLY valid JSON.

Return EXACTLY 10 questions.

Required structure:

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

============================================================
STRICT JSON RULES
============================================================

- Exactly 10 question objects.
- Exactly 4 options per question.
- "correct" must be an integer from 0 to 3.
- "explanation" must explain why the correct option is correct.
- No Markdown.
- No code fences.
- No text outside JSON.
- No additional top-level properties.
`;

  try {
    console.log("🧠 KAKU QUIZ GENERATION REQUEST:", {
      model: KAKU_MODEL,
      subject,
      topic,
      academicRange: "Class 11 → BSc Final Semester",
    });

    const response = await groq.chat.completions.create({
      model: KAKU_MODEL,

      messages: [
        {
          role: "system",
          content: `
${KAKU_IDENTITY}

You are an expert academic examination-question generator.

The SUBJECT and TOPIC supplied by the user are authoritative.

The TOPIC is a strict content boundary.

The permitted academic range is:

Class 11 → Class 12 → BSc Undergraduate → BSc Final Semester

Never generate:
- content below Class 11
- MSc content
- postgraduate content
- PhD content
- research-level specialist content

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

      // Current Groq production model.
      model: KAKU_MODEL,

      // JSON Object Mode.
      response_format: {
        type: "json_object",
      },

      // Important for GPT-OSS when using JSON mode.
      reasoning_format: "hidden",

      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content;

    console.log("🤖 KAKU QUIZ RESPONSE RECEIVED");

    if (!content) {
      throw new Error("Groq returned an empty quiz response.");
    }

    console.log("🤖 KAKU RAW QUIZ RESPONSE:", content);

    const data = JSON.parse(content);

    if (!Array.isArray(data?.questions)) {
      throw new Error(
        "Groq returned JSON, but the 'questions' array is missing."
      );
    }

    if (data.questions.length === 0) {
      throw new Error("Groq returned an empty questions array.");
    }

    return data.questions;
  } catch (error: any) {
    console.error("❌ KAKU QUIZ ENGINE FAILURE:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      type: error?.type,
    });

    throw new Error(
      error?.message || "Failed to generate quiz questions via Groq."
    );
  }
};