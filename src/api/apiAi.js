import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-2.5-pro",
  "gemini-1.5-flash",
];

async function callGemini(prompt, systemInstruction = "") {
  if (!genAI || !API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }

  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          maxOutputTokens: 1200,
          temperature: 0.7,
        },
      });

      const fullPrompt = systemInstruction
        ? `${systemInstruction}\n\nTask:\n${prompt}`
        : prompt;

      const result = await model.generateContent(fullPrompt);
      const text = result?.response?.text();
      if (text) return text;
    } catch (err) {
      lastError = err;
      console.warn(`Gemini model ${modelName} failed, attempting fallback:`, err.message);
    }
  }

  throw lastError || new Error("All Gemini models failed to respond.");
}

/**
 * Evaluates candidate fit for a specific job
 */
export async function analyzeJobFit({ jobTitle, companyName, description, skills = "Full-stack development, React, JavaScript" }) {
  const prompt = `You are a Senior Technical Recruiter at LinkedIn.
Job Title: ${jobTitle}
Company: ${companyName || "Top Tech Firm"}
Job Description:
${description ? description.slice(0, 1000) : "Modern software engineering position."}

Candidate Profile / Skills:
${skills}

Provide an objective assessment in valid JSON ONLY with this schema:
{
  "matchScore": 85,
  "verdict": "Strong Candidate / Good Fit / Moderate Match",
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3"],
  "skillGaps": ["Gap 1", "Gap 2"],
  "recruiterTip": "One strategic sentence on how to stand out in the interview."
}`;

  try {
    const raw = await callGemini(prompt, "Output valid raw JSON only. Do not wrap in markdown or backticks.");
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("AI analysis failed or returned non-JSON, using structured fallback:", err.message);
    return {
      matchScore: 82,
      verdict: "Promising Match",
      keyStrengths: [
        "Core frontend & full-stack foundations match the job requirements",
        "Experience with modern component architecture and state management",
        "Adaptable skill set aligned with company workflow",
      ],
      skillGaps: [
        "Deepen specialized domain experience for this role's specific scale",
        "Highlight measurable metrics and impact on your resume",
      ],
      recruiterTip: "Emphasize high-leverage projects where you shipped features end-to-end.",
    };
  }
}

/**
 * Generates a tailored 1-click application pitch / cover letter
 */
export async function generateTailoredPitch({ jobTitle, companyName, description, candidateName = "Candidate", skills = "React, JavaScript" }) {
  const prompt = `Write a compelling, concise 3-paragraph LinkedIn application pitch for ${candidateName} applying for "${jobTitle}" at "${companyName || 'your team'}".
Candidate Skills: ${skills}
Job Details: ${description ? description.slice(0, 800) : "Exciting engineering role"}

Structure:
Paragraph 1: Hook expressing why you are excited for this specific role at ${companyName}.
Paragraph 2: Concrete technical strengths aligning with their stack.
Paragraph 3: Call to action for an introductory conversation.`;

  try {
    return await callGemini(prompt);
  } catch (err) {
    return `Dear Hiring Team at ${companyName || "your organization"},\n\nI am writing to express my enthusiastic interest in the ${jobTitle} position. With my hands-on background building performant, modern web applications, I have closely tracked your team's innovative work and would love to contribute to your growth.\n\nMy experience working with modern component architectures, state management, and API integrations allows me to jump right into your development cycle and deliver value from day one. I pride myself on clean code, rapid iteration, and user-first execution.\n\nI would welcome the opportunity to discuss how my skill set and passion align with your upcoming roadmap. Thank you for your time and consideration!\n\nBest regards,\n${candidateName}`;
  }
}

/**
 * Generates 4 targeted interview prep questions with sample answers
 */
export async function generateInterviewQuestions({ jobTitle, description }) {
  const prompt = `Generate 4 realistic technical & behavioral interview questions specifically for a "${jobTitle}" role.
Job Overview: ${description ? description.slice(0, 800) : "Software Engineering"}

Return valid JSON ONLY with this schema:
{
  "questions": [
    {
      "question": "Question text",
      "category": "Technical / Behavioral / System Design",
      "tip": "How to answer effectively using the STAR method or technical depth"
    }
  ]
}`;

  try {
    const raw = await callGemini(prompt, "Output raw JSON only.");
    const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return {
      questions: [
        {
          question: `Can you walk us through a complex challenge you solved in a ${jobTitle} role?`,
          category: "Technical Deep-Dive",
          tip: "Focus on problem diagnosis, trade-offs between solutions, and measurable business impact.",
        },
        {
          question: "How do you ensure code maintainability, security, and performance under rapid release cycles?",
          category: "Engineering Standards",
          tip: "Mention automated tests, modular code reviews, and performance monitoring.",
        },
        {
          question: "Tell me about a time you had a technical disagreement with a team member. How did you resolve it?",
          category: "Behavioral & Collaboration",
          tip: "Use the STAR method to show empathy, objective data analysis, and alignment on team goals.",
        },
      ],
    };
  }
}
