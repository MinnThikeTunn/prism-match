import process from "node:process";
import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, O as Outlet, S as Scripts } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-CZlUCYGL.css";
const Route$3 = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
      },
      { rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }
    ]
  }),
  component: RootComponent
});
function RootComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "bg-[#F9F7F2] text-[#1A1A1A] antialiased selection:bg-black selection:text-white", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter = () => import("./index-udAZcmgn.mjs");
const Route$2 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Matchwise Prism — Context-Aware Human Matching"
    }, {
      name: "description",
      content: "Deterministic 3-tier algorithm scoring, Prism Spectrum visualization, and explainable AI synergy metrics for human matching."
    }, {
      property: "og:title",
      content: "Matchwise Prism — Context-Aware Human Matching"
    }, {
      property: "og:description",
      content: "Deterministic scoring, Prism Spectrum visualization, and explainable synergy metrics."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "twitter:card",
      content: "summary_large_image"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route$1 = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const { userA, userB, matchResult } = body ?? {};
        if (!userA || !userB || !matchResult) {
          return Response.json(
            { error: "userA, userB and matchResult are required" },
            { status: 400 }
          );
        }
        const apiKey = process.env["GEMINI_API_KEY"];
        if (apiKey) {
          try {
            const prompt = `You are the Matchwise Prism Explainable AI (XAI) engine.
Explain the synergy match between ${userA.name} (${userA.title}) and ${userB.name} (${userB.title}).
Final Match Score is strictly deterministic: ${matchResult.finalMatchScore}%.
Prism Synergy Label: "${matchResult.synergyLabel}".
Generate a concise, high-craft explanation with 3 specific Key Drivers.
Return ONLY valid JSON with format:
{
  "synergyDescription": string,
  "keyDrivers": [
    { "title": string, "description": string, "type": "technical" | "communication" | "risk" | "values", "scoreImpact": number }
  ]
}`;
            const { GoogleGenAI } = await import("../_libs/google__genai.mjs");
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: { responseMimeType: "application/json" }
            });
            if (response.text) {
              return Response.json({
                success: true,
                source: "gemini",
                explanation: JSON.parse(response.text)
              });
            }
          } catch (err) {
            console.warn("Gemini explanation fallback triggered:", err);
          }
        }
        return Response.json({
          success: true,
          source: "deterministic-template",
          explanation: {
            synergyDescription: matchResult.synergyDescription,
            keyDrivers: matchResult.keyDrivers
          }
        });
      }
    }
  }
});
function ruleBasedCriteria(prompt) {
  const lower = prompt.toLowerCase();
  const requiredRoles = [];
  const requiredSkills = [];
  if (lower.includes("python") || lower.includes("backend")) {
    requiredRoles.push({ role: "Backend Engineer", count: lower.includes("2") ? 2 : 1 });
    requiredSkills.push("Python", "Distributed Systems", "PostgreSQL");
  }
  if (lower.includes("designer") || lower.includes("ux") || lower.includes("ui")) {
    requiredRoles.push({ role: "UI/UX Designer", count: 1 });
    requiredSkills.push("Figma", "Design Systems", "Creative Prototyping");
  }
  if (lower.includes("lead") || lower.includes("architect") || lower.includes("frontend")) {
    requiredRoles.push({ role: "Lead Architect", count: 1 });
    requiredSkills.push("React / TypeScript", "System Design");
  }
  if (requiredRoles.length === 0) {
    requiredRoles.push({ role: "Core Collaborator", count: 2 });
    requiredSkills.push("Full-Stack Development", "Problem Solving");
  }
  return {
    targetSubMode: "CUSTOM_AI_MATCH",
    targetTeamSize: requiredRoles.reduce((a, r) => a + r.count, 0) || 3,
    requiredRoles,
    requiredSkills,
    minExecutionDrive: lower.includes("high execution") ? 85 : 75,
    preferredTimezone: "UTC-8 to UTC+1 (Flexible)",
    domainFocus: "Design Systems & Scalable AI Infrastructure"
  };
}
const Route = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        const prompt = body?.prompt;
        if (!prompt || typeof prompt !== "string") {
          return Response.json({ error: "Prompt string is required" }, { status: 400 });
        }
        const apiKey = process.env["GEMINI_API_KEY"];
        if (apiKey) {
          try {
            const systemInstruction = `You are the Matchwise Prism criteria schema parser. Convert the user's natural language matching request into a structured JSON Criteria Card.
Return ONLY valid JSON matching this schema:
{
  "targetSubMode": "HACKATHON_TEAMS" | "PROJECT_GROUPS" | "CUSTOM_AI_MATCH" | "NETWORKING" | "MENTORSHIP",
  "targetTeamSize": number,
  "requiredRoles": [{"role": string, "count": number}],
  "requiredSkills": string[],
  "minExecutionDrive": number,
  "preferredTimezone": string,
  "domainFocus": string
}`;
            const { GoogleGenAI } = await import("../_libs/google__genai.mjs");
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: { systemInstruction, responseMimeType: "application/json" }
            });
            if (response.text) {
              return Response.json({ success: true, source: "gemini", criteria: JSON.parse(response.text) });
            }
          } catch (err) {
            console.warn("Gemini parser fallback triggered:", err);
          }
        }
        return Response.json({
          success: true,
          source: "rule-based-fallback",
          criteria: ruleBasedCriteria(prompt)
        });
      }
    }
  }
});
const IndexRoute = Route$2.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const ApiExplainMatchRoute = Route$1.update({
  id: "/api/explain-match",
  path: "/api/explain-match",
  getParentRoute: () => Route$3
});
const ApiParseCustomMatchRoute = Route.update({
  id: "/api/parse-custom-match",
  path: "/api/parse-custom-match",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  ApiExplainMatchRoute,
  ApiParseCustomMatchRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent"
  });
}
export {
  getRouter
};
