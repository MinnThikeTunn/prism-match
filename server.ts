import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Matchwise Prism Engine' });
});

// Custom AI Match Pipeline - Natural Language Prompt to Schema Parser (FR-6.2)
app.post('/api/parse-custom-match', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt string is required' });
  }

  const ai = getAI();
  if (ai) {
    try {
      const systemInstruction = `You are the Matchwise Prism criteria schema parser. Convert the user's natural language matching request into a structured JSON Criteria Card.
Return ONLY valid JSON matching this schema:
{
  "targetSubMode": "HACKATHON_TEAMS" | "PROJECT_GROUPS" | "CUSTOM_AI_MATCH" | "NETWORKING" | "MENTORSHIP",
  "targetTeamSize": number (default 3),
  "requiredRoles": [{"role": string, "count": number}],
  "requiredSkills": string[],
  "minExecutionDrive": number (0-100),
  "preferredTimezone": string,
  "domainFocus": string
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini',
          criteria: parsed
        });
      }
    } catch (err) {
      console.warn('Gemini parser fallback triggered:', err);
    }
  }

  // Graceful rule-based deterministic fallback parser
  const lower = prompt.toLowerCase();
  const requiredRoles: { role: string; count: number }[] = [];
  const requiredSkills: string[] = [];

  if (lower.includes('python') || lower.includes('backend')) {
    requiredRoles.push({ role: 'Backend Engineer', count: lower.includes('2') ? 2 : 1 });
    requiredSkills.push('Python', 'Distributed Systems', 'PostgreSQL');
  }
  if (lower.includes('designer') || lower.includes('ux') || lower.includes('ui')) {
    requiredRoles.push({ role: 'UI/UX Designer', count: 1 });
    requiredSkills.push('Figma', 'Design Systems', 'Creative Prototyping');
  }
  if (lower.includes('lead') || lower.includes('architect') || lower.includes('frontend')) {
    requiredRoles.push({ role: 'Lead Architect', count: 1 });
    requiredSkills.push('React / TypeScript', 'System Design');
  }
  if (requiredRoles.length === 0) {
    requiredRoles.push({ role: 'Core Collaborator', count: 2 });
    requiredSkills.push('Full-Stack Development', 'Problem Solving');
  }

  return res.json({
    success: true,
    source: 'rule-based-fallback',
    criteria: {
      targetSubMode: 'CUSTOM_AI_MATCH',
      targetTeamSize: requiredRoles.reduce((a, r) => a + r.count, 0) || 3,
      requiredRoles,
      requiredSkills,
      minExecutionDrive: lower.includes('high execution') ? 85 : 75,
      preferredTimezone: 'UTC-8 to UTC+1 (Flexible)',
      domainFocus: 'Design Systems & Scalable AI Infrastructure'
    }
  });
});

// XAI Match Explanation Generator (FR-8.4)
app.post('/api/explain-match', async (req, res) => {
  const { userA, userB, matchResult } = req.body;
  if (!userA || !userB || !matchResult) {
    return res.status(400).json({ error: 'userA, userB and matchResult are required' });
  }

  const ai = getAI();
  if (ai) {
    try {
      const prompt = `You are the Matchwise Prism Explainable AI (XAI) engine.
Explain the synergy match between ${userA.name} (${userA.title}) and ${userB.name} (${userB.title}).
Final Match Score is strictly deterministic: ${matchResult.finalMatchScore}%.
Prism Synergy Label: "${matchResult.synergyLabel}".
Generate a concise, high-craft explanation with 3 specific Key Drivers.
Return ONLY valid JSON with format:
{
  "synergyDescription": string (2 sentences),
  "keyDrivers": [
    { "title": string, "description": string, "type": "technical" | "communication" | "risk" | "values", "scoreImpact": number }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini',
          explanation: parsed
        });
      }
    } catch (err) {
      console.warn('Gemini explanation fallback triggered:', err);
    }
  }

  return res.json({
    success: true,
    source: 'deterministic-template',
    explanation: {
      synergyDescription: matchResult.synergyDescription,
      keyDrivers: matchResult.keyDrivers
    }
  });
});

// Vite / static file serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Matchwise Prism Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
