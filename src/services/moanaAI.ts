import Groq from "groq-sdk";

// ============================================================
// GROQ CONFIGURATION
// ============================================================

// Server-side only.
// Make sure GROQ_API_KEY is NOT prefixed with NEXT_PUBLIC_.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Current Groq production model.
const KAKU_MODEL = "openai/gpt-oss-20b";

// ============================================================
// KAKU IDENTITY
// ============================================================

const KAKU_IDENTITY = `
You are KAKU.

Created by Priyamjyoti Dihingia.

You are a master of Physics, Chemistry, Botany, and Zoology
curriculum from Class 11 through BSc Final Semester level.

You provide academically accurate, structured educational content.
`;

// ============================================================
// GENERATE MIND MAP
// ============================================================

export const generateMindMap = async (rawText: string) => {
  const prompt = `
COMMAND:
Perform an EXHAUSTIVE ANALYSIS of the following scientific text
and synthesize it into a SINGLE UNIFIED mind map.

TEXT:
"${rawText}"

============================================================
INSTRUCTIONS
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

within the single hierarchy.

4. QUALITY NOTES

Every node MUST have a "description".

The description should function as a high-quality study note.

5. SOURCE BOUNDARY

Base the mind map primarily on the supplied scientific text.

Do not introduce unrelated concepts.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY a valid JSON object.

Use EXACTLY this structure:

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

Do not output:

- Markdown
- Code fences
- Explanations outside JSON
- Comments
- Additional top-level properties
`;

  try {
    console.log("🧠 KAKU MIND MAP GENERATION:", {
      model: KAKU_MODEL,
      inputLength: rawText.length,
    });

    const response = await groq.chat.completions.create({
      model: KAKU_MODEL,

      messages: [
        {
          role: "system",
          content: `
${KAKU_IDENTITY}

You are generating structured educational data.

Output ONLY valid JSON.
Do not output Markdown.
Do not output commentary outside JSON.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      response_format: {
        type: "json_object",
      },

      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content;

    console.log("🤖 KAKU MIND MAP RESPONSE RECEIVED");

    if (!content) {
      throw new Error("Groq returned an empty mind map response.");
    }

    const parsed = JSON.parse(content);

    if (!parsed || !parsed.map) {
      throw new Error(
        "KAKU response did not contain the required mind map structure."
      );
    }

    return {
      maps: [parsed.map],
    };
  } catch (error: any) {
    console.error("❌ KAKU ARCHITECT ERROR:", {
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
// GENERATE KAKU QUIZ
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

ALL questions must be appropriate for the following academic
range:

CLASS 11
→ CLASS 12
→ BSc UNDERGRADUATE
→ UP TO BSc FINAL SEMESTER

DO NOT generate content below Class 11 level.

DO NOT generate content above final-semester BSc level.

STRICTLY EXCLUDE:

- Primary-school level material
- Middle-school level material
- Overly elementary questions below Class 11
- MSc-level material
- Postgraduate-level material
- PhD-level material
- Research-level specialist concepts
- Highly specialized research methodologies
- Advanced graduate-only mathematics
- Obscure research literature
- Highly specialized theories normally introduced after BSc
- Unnecessarily advanced derivations beyond undergraduate level

============================================================
SUBJECT BOUNDARY — CRITICAL
============================================================

EVERY question MUST belong to:

${subject}

NEVER switch to another subject.

For example:

If SUBJECT = Botany,
do not generate Chemistry, Physics, or Zoology questions.

============================================================
TOPIC BOUNDARY — MOST IMPORTANT
============================================================

EVERY question MUST DIRECTLY belong to:

${topic}

The topic is a HARD CONTENT BOUNDARY.

Do not drift into unrelated chapters.

Do not generate questions simply because they are generally
related to the subject.

============================================================
QUESTION QUALITY
============================================================

Generate EXACTLY 10 high-quality MCQs.

Questions should test appropriate combinations of:

- Conceptual understanding
- Scientific reasoning
- Application
- Interpretation
- Important facts
- Mechanisms
- Processes
- Classification
- Cause and effect
- Comparison

where applicable to the requested topic.

Avoid unnecessarily trivial questions.

Avoid obscure research-level questions.

Avoid duplicate questions.

============================================================
QUESTION STRUCTURE
============================================================

Every question MUST have:

1. One question
2. Exactly four options
3. One correct option
4. A scientific explanation

The "correct" value must be the zero-based index
of the correct option.

Therefore:

0 = Option 0
1 = Option 1
2 = Option 2
3 = Option 3

============================================================
FINAL OUTPUT REQUIREMENTS
============================================================

Return EXACTLY 10 questions.

Return ONLY valid JSON.

The JSON MUST have exactly this structure:

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
- Every question must have one correct answer.
- Every explanation must explain the correct answer.
- No Markdown.
- No code fences.
- No text outside JSON.
- No additional top-level properties.
`;

  try {
    console.log("🧠 KAKU QUIZ GENERATION:", {
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

The SUBJECT and TOPIC provided by the user are authoritative.

The TOPIC is a strict content boundary.

The permitted academic range is strictly:

Class 11
→ Class 12
→ BSc Undergraduate
→ BSc Final Semester

Never generate content below Class 11.

Never generate MSc-level content.

Never generate postgraduate-level content.

Never generate PhD-level content.

Never generate research-level specialist content.

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

      response_format: {
        type: "json_object",
      },

      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content;

    console.log("🤖 KAKU RAW QUIZ RESPONSE:", content);

    if (!content) {
      throw new Error("Groq returned an empty quiz response.");
    }

    const data = JSON.parse(content);

    if (!data || !Array.isArray(data.questions)) {
      throw new Error(
        "KAKU returned invalid questions format."
      );
    }

    if (data.questions.length === 0) {
      throw new Error(
        "KAKU returned an empty questions array."
      );
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
      error?.message ||
        "Failed to generate quiz questions via Groq."
    );
  }
};