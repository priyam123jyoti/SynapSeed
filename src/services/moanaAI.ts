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
      model: "gpt-oss-120b", // Updated from llama-3.3-70b-versatile
      response_format: { type: "json_object" },
      temperature: 0.3, 
    });

    const content = response.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;

    if (parsed && parsed.map) {
      return { maps: [parsed.map] };
    }
    
    return { maps: [] };
  } catch (error) {
    console.error("KAKU ARCHITECT ERROR:", error);
    return { maps: [] };
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

CLASS 11
→ CLASS 12
→ BSc Undergraduate
→ UP TO BSc FINAL SEMESTER

This is the COMPLETE permitted academic range.

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

The quiz may contain both school-level and undergraduate-level
questions, but the overall academic range must remain between
Class 11 and final-semester BSc.

============================================================
SUBJECT BOUNDARY — CRITICAL
============================================================

EVERY question MUST belong to:

${subject}

Never switch to another subject.

The question, options, correct answer, and explanation must all
remain scientifically consistent with the selected subject.

Examples:

PHYSICS → Physics only
CHEMISTRY → Chemistry only
BOTANY → Botany / Plant Biology only
ZOOLOGY → Zoology / Animal Biology only

If the subject is PHYSICS, do not generate Chemistry, Botany,
or Zoology questions.

If the subject is CHEMISTRY, do not generate Physics, Botany,
or Zoology questions.

If the subject is BOTANY, do not generate general Zoology or
Physics questions.

If the subject is ZOOLOGY, do not generate Botany questions.

============================================================
TOPIC BOUNDARY — MOST IMPORTANT RULE
============================================================

Every question MUST DIRECTLY belong to:

${topic}

Do NOT merely generate a question because it belongs to the
broader subject.

The selected topic is the exact module the student requested.

Before accepting every question, internally ask:

"Would this question naturally belong in a textbook chapter,
lecture, syllabus unit, or examination module specifically
called '${topic}'?"

If the answer is NO, reject that question and generate another.

Do not use unrelated concepts merely because they are from the
same subject.

============================================================
EXAMPLE OF TOPIC CONTROL
============================================================

If:

SUBJECT = PHYSICS
TOPIC = Vectors & Scalars

Appropriate areas include:

- scalar and vector quantities
- magnitude and direction
- vector representation
- unit vectors
- vector components
- resolution of vectors
- vector addition
- vector subtraction
- position vectors
- dot product where appropriate to the academic level
- cross product where appropriate to the academic level
- vector algebra and applications appropriate to Class 11–BSc

Do NOT generate unrelated questions primarily about:

- thermodynamics
- electrostatics
- current electricity
- optics
- nuclear physics
- semiconductor physics
- gravitation

unless they are genuinely and directly part of the requested
Vectors & Scalars module.

------------------------------------------------------------

If:

SUBJECT = PHYSICS
TOPIC = Waves & Sound

Prefer questions involving:

- wave motion
- wavelength
- frequency
- amplitude
- phase
- wave velocity
- wave equation
- transverse and longitudinal waves
- sound waves
- propagation of sound
- speed of sound
- intensity
- loudness
- resonance
- standing waves
- nodes and antinodes
- harmonics
- beats
- Doppler effect
- acoustic phenomena
- appropriate numerical applications

Do NOT drift into unrelated Physics modules such as:

- electrostatics
- semiconductor electronics
- nuclear physics
- thermodynamics
- rotational mechanics
- general ray optics

unless the requested topic explicitly includes them.

Apply the same strict topic-boundary principle to Chemistry,
Botany, and Zoology.

============================================================
QUESTION QUALITY
============================================================

Generate EXACTLY 10 high-quality MCQs.

The questions should resemble questions suitable for:

- Class 11 examinations
- Class 12 examinations
- NEET/JEE/other relevant competitive preparation where
  appropriate
- BSc university examinations
- BSc final-semester academic preparation

The difficulty should vary naturally WITHIN the allowed
Class 11 → BSc final-semester range.

Use a balanced mixture of:

- conceptual understanding
- factual understanding when academically appropriate
- application
- analytical reasoning
- numerical/problem-solving where appropriate
- interpretation of scientific relationships
- higher-order undergraduate reasoning where appropriate

Do NOT force numerical questions into topics where they are
unnatural.

Do NOT make every question extremely easy.

Do NOT make every question extremely difficult.

============================================================
QUESTION DISTRIBUTION
============================================================

Across the 10 questions, aim for a natural mixture such as:

- 2–3 foundational/conceptual questions
- 3–4 application or analytical questions
- 2–3 BSc-level questions
- numerical/problem-solving questions where appropriate

The exact distribution may vary depending on the topic.

For a topic that is naturally numerical, include meaningful
numerical problems.

For a topic that is mainly conceptual, prioritize conceptual and
analytical questions.

============================================================
QUESTION UNIQUENESS — CRITICAL
============================================================

ALL 10 QUESTIONS MUST BE MEANINGFULLY UNIQUE.

Never repeat:

- the exact same question
- the same numerical problem
- the same scenario
- the same reasoning pattern with superficial wording changes
- the same question with only different numbers

Do not create duplicate questions.

Before returning the final JSON, internally compare all
10 questions for similarity.

If two questions are too similar, replace one.

============================================================
QUESTION WORDING
============================================================

Use natural academic language.

Vary the question structures.

Do not start every question with:

"What is..."
"Which of the following..."

Use a mixture of:

- direct conceptual questions
- scenario-based questions
- application questions
- numerical questions
- statement-based questions
- comparison questions
- interpretation questions

Avoid unnecessarily complicated wording.

The question must be clearly understandable.

============================================================
MCQ OPTIONS
============================================================

Every question MUST have EXACTLY 4 options.

There must be EXACTLY ONE correct answer.

Options must be:

- plausible
- scientifically relevant
- grammatically consistent with the question
- appropriate for the academic level

Wrong options must represent realistic misconceptions where
possible.

DO NOT use:

- "All of the above"
- "None of the above"
- duplicate options
- irrelevant options
- ridiculous or obviously impossible distractors

============================================================
CORRECT ANSWER
============================================================

The "correct" field MUST be an integer:

0
1
2
or
3

It must correspond exactly to the position of the correct option.

Do not provide the answer as text.

============================================================
SCIENTIFIC ACCURACY
============================================================

Before returning the final JSON, internally verify every question.

For each question check:

1. The scientific statement is correct.
2. The question is unambiguous.
3. Exactly one option is correct.
4. The correct index points to the truly correct option.
5. The three distractors are genuinely incorrect.
6. Any numerical calculation is correct.
7. Units are correct.
8. Equations and terminology are correct.
9. The explanation agrees with the correct answer.
10. The question belongs directly to ${topic}.
11. The question belongs to ${subject}.
12. The academic level is within Class 11 → BSc final semester.

Never invent scientific information.

============================================================
EXPLANATION REQUIREMENT
============================================================

Every question MUST include a high-quality explanation.

The explanation must:

- explain WHY the correct answer is correct
- mention the relevant scientific principle
- be specific to that question
- be educational
- be appropriate for the Class 11–BSc range

Never use generic filler such as:

"Biological data pattern confirmed."

"The correct answer is obvious."

"This is scientifically correct."

The explanation must contain actual scientific reasoning.

============================================================
FINAL TOPIC VALIDATION
============================================================

For EACH question, internally perform this test:

SUBJECT TEST:
Does this question belong to ${subject}?

TOPIC TEST:
Does this question specifically belong to ${topic},
rather than merely belonging to the broader subject?

LEVEL TEST:
Is this appropriate between Class 11 and BSc final semester?

If ANY answer is NO:

DO NOT RETURN THE QUESTION.

Generate a replacement.

============================================================
FINAL DUPLICATE VALIDATION
============================================================

Before returning the final answer:

- compare all 10 question texts
- compare their scenarios
- compare numerical setups
- compare their tested concepts

If any two are substantially similar, replace one.

============================================================
FINAL OUTPUT REQUIREMENTS
============================================================

Return EXACTLY 10 questions.

Return ONLY valid JSON.

Use exactly this structure:

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

Do not include:

- markdown
- code fences
- headings
- commentary
- introductory text
- concluding text

Return ONLY the JSON object.

============================================================
FINAL INTERNAL CHECKLIST
============================================================

Before returning the JSON, verify:

[ ] Exactly 10 questions.
[ ] Every question belongs to ${subject}.
[ ] Every question directly belongs to ${topic}.
[ ] No generic subject-only questions.
[ ] No unrelated-topic drift.
[ ] Academic level is Class 11 → BSc final semester.
[ ] No below-Class-11 material.
[ ] No MSc/PhD/research-level material.
[ ] All questions are unique.
[ ] Exactly 4 options per question.
[ ] Exactly one correct option per question.
[ ] correct is 0, 1, 2, or 3.
[ ] Explanations are specific and scientifically accurate.
[ ] Numerical calculations are correct where applicable.
[ ] No ambiguous questions.
[ ] No duplicate scenarios.
[ ] Output contains exactly one JSON object.
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

The permitted academic range is strictly:
Class 11 → Class 12 → BSc Undergraduate up to Final Semester.

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
      model: "gpt-oss-120b", // Updated from llama-3.3-70b-versatile
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;

    console.log("🤖 KAKU RAW QUIZ RESPONSE:", content);

    const data = content ? JSON.parse(content) : {};

    if (!Array.isArray(data.questions)) {
      console.error("❌ KAKU returned invalid questions format.");
      return [];
    }

    return data.questions;
  } catch (error) {
    console.error("KAKU QUIZ ENGINE FAILURE:", error);
    return [];
  }
};