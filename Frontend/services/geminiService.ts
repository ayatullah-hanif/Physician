import { GoogleGenAI, Type } from "@google/genai";
import { PhysicianAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the PHYSICIAN Infrastructure Engine. You are a cross-platform verification layer for Physical AI systems.
Your Role: Receive raw sensor data (image) and proposed intent (text) from a physical agent.
Your Task: Perform a Chain-of-Causation analysis to verify if the agent's intent aligns with physical reality.

Analysis Guidelines (IMPORTANT):
1. GOVERNOR MINDSET: You are an enabler, not a blocker. If an action is standard (e.g., picking up objects, moving slowly) and physically feasible, you must 'PASS' it.
2. THRESHOLD OF SAFETY: Only issue a 'FAIL' if there is a clear violation of physics (e.g., impossible weight, collision path) or high danger.
3. LOGIC GATE STATES:
   - PASS: Safe to proceed. Set gate to 'OPEN'.
   - WARNING: Risky but possible. Set gate to 'OPEN' (with adjustments).
   - FAIL: Physically impossible or dangerous. Set gate to 'CLOSED'.
4. FORENSIC MODE: ONLY if status is 'FAIL', provide a "Forensic Report".

Output strictly in JSON format matching the schema provided.
`;

export const analyzeKinematics = async (
  base64Image: string,
  intent: string,
  simulateCrash: boolean = false
): Promise<PhysicianAnalysis> => {
  try {
    const promptText = simulateCrash 
      ? `PROPOSED INTENT: ${intent}\n\n*** STRESS TEST MODE ACTIVE ***\nINSTRUCTION: IGNORE ACTUAL SAFETY. SIMULATE A CATASTROPHIC FAILURE for this action. Assume the robot crashed. You MUST return status 'FAIL'. Invent a plausible physical reason (e.g., hydraulic failure, friction loss, center-of-mass shift) and generate a detailed forensic_report explaining the crash.`
      : `PROPOSED INTENT: ${intent}\n\nAnalyze this kinematic scenario. Default to PASS for reasonable commands. If unsafe, generate a forensic crash report.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            agent_type: { type: Type.STRING, description: "Auto-detected agent (e.g., Robotic Arm, Drone)" },
            status: { type: Type.STRING, enum: ["PASS", "FAIL", "WARNING"] },
            logic_trace: { type: Type.STRING, description: "Detailed reasoning chain" },
            physics_overrides: {
              type: Type.ARRAY,
              description: "List of physics parameters that need to be overridden/adjusted",
              items: {
                type: Type.OBJECT,
                properties: {
                  parameter: { type: Type.STRING },
                  value: { type: Type.STRING }
                },
                required: ["parameter", "value"]
              }
            },
            kinematics: {
              type: Type.OBJECT,
              properties: {
                mass_estimation: { type: Type.STRING },
                friction_coefficient: { type: Type.STRING },
                center_of_mass: { type: Type.STRING },
              },
              required: ["mass_estimation", "friction_coefficient", "center_of_mass"]
            },
            contextual_risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            logic_gate: {
              type: Type.OBJECT,
              properties: {
                safety_constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                adjustments_required: { type: Type.ARRAY, items: { type: Type.STRING } },
                final_verdict: { type: Type.STRING, enum: ["OPEN", "CLOSED"] }
              },
              required: ["safety_constraints", "adjustments_required", "final_verdict"]
            },
            simulation_outcome: { type: Type.STRING, description: "Predicted outcome of the action" },
            forensic_report: {
              type: Type.OBJECT,
              description: "Only populated if status is FAIL. Detailed breakdown of the simulated crash.",
              properties: {
                failure_signature: { type: Type.STRING, description: "e.g., 'Topple Event > 45deg' or 'Grip Shear Failure'" },
                primary_law_violated: { type: Type.STRING, description: "e.g., 'Conservation of Angular Momentum', 'Static Friction Limit'" },
                reconstruction_analysis: { type: Type.STRING, description: "Explanation of the crash mechanics." },
                governor_patch: { type: Type.STRING, description: "Recommended parameter adjustment to prevent recurrence." }
              },
              required: ["failure_signature", "primary_law_violated", "reconstruction_analysis", "governor_patch"]
            }
          },
          required: ["agent_type", "status", "logic_trace", "physics_overrides", "kinematics", "contextual_risks", "logic_gate", "simulation_outcome"]
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PhysicianAnalysis;
    }
    throw new Error("No response text from Gemini");
  } catch (error) {
    console.error("Analysis Failed:", error);
    throw error;
  }
};