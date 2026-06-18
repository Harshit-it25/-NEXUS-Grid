import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ==========================================
  // REAL-TIME AI REPORT NARRATIVE ENDPOINT
  // ==========================================
  app.post("/api/generate-narrative", async (req, res) => {
    const { region, horizon, evAdoption, renewableTarget, consensusScore } = req.body;

    const regionStr = region ? `${region} Region` : "National Scope";
    const horizonStr = horizon ? `Target Horizon Year ${horizon}` : "Default Horizon";

    // Dynamic fallback builder to ensure robustness without key
    const getFallbackNarrative = () => {
      const consensusDesc =
        consensusScore >= 75
          ? "Strong multi-stakeholder consensus is achieved, highlighting cooperative alignment between environmentalists and grid operators."
          : "Consensus remains constrained due to policy friction regarding capex funding models and microgrid tariff protection.";
      
      const renDesc =
        renewableTarget >= 75
          ? `The target of ${renewableTarget}% renewables marks an aggressive push into solar/wind generation, requiring grid hardening and battery banks.`
          : `The baseline of ${renewableTarget}% renewables offers structural stability with moderate grid inertia risks.`;

      return `EXECUTIVE BRIEFING [${regionStr} - ${horizonStr}]: ${renDesc} EV Fleet integration is modeled at ${evAdoption || 40}% load. ${consensusDesc}`;
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Return rule-based fallback when API key is not configured
      return res.json({
        narrative: getFallbackNarrative(),
        isAiGenerated: false
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Act as a Principal Product Architect, Senior Frontend Engineer, and Utility Planning Systems Designer.
        Generate a concise, 3-sentence professional boardroom executive summary report briefing.
        Use a formal, authoritative, and boardroom-ready compliance tone.
        Summarize the active state of the NEXUS Grid:
        - Planning Scope: ${regionStr}
        - Target Year: ${horizonStr}
        - EV Fleet load integration: ${evAdoption || 40}%
        - Target Renewables: ${renewableTarget || 60}%
        - Stakeholder Consensus Score: ${consensusScore || 70}%
        Highlight recommendations or potential grid safety bottlenecks. Keep it under 80 words. Do not use placeholders.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = response.text ? response.text.trim() : getFallbackNarrative();

      res.json({
        narrative: text,
        isAiGenerated: true
      });
    } catch (err: any) {
      console.error("Gemini API generation failed, falling back:", err.message);
      res.json({
        narrative: getFallbackNarrative(),
        isAiGenerated: false,
        error: err.message
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
