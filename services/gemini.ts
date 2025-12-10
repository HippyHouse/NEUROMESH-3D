import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeImageAndGenerateScript = async (file: File, apiKey: string): Promise<GeminiResponse> => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  const imagePart = await fileToGenerativePart(file);

  const prompt = `
    You are an expert Technical Artist for AAA games.
    
    1. Analyze the input image (character concept art).
    2. Deconstruct the character into a set of 3D primitive shapes (block-out phase).
    3. Define the physical materials (PBR values).
    4. Write a Python script for Blender (using the 'bpy' module) that:
       - Clears the scene.
       - Creates these primitive shapes (Cubes, Spheres, Cylinders) positioned roughly to form the character's silhouette.
       - Creates basic materials with the colors from the image and applies them.
       - Names the objects correctly (Head, Torso, Arm_L, etc.).
       - Sets the scene up for export.

    RETURN JSON ONLY.
    The response must follow the schema defined.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Strong reasoning for code generation
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                characterName: { type: Type.STRING },
                archetype: { type: Type.STRING },
                estimatedHeight: { type: Type.STRING },
                complexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                topologyStrategy: { type: Type.STRING },
                riggingNotes: { type: Type.STRING },
                parts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['Cube', 'Sphere', 'Cylinder', 'Cone'] },
                      dimensions: { type: Type.STRING },
                      material: { type: Type.STRING },
                      description: { type: Type.STRING }
                    }
                  }
                },
                materials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      roughness: { type: Type.NUMBER },
                      metallic: { type: Type.NUMBER },
                      baseColorHex: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            blenderScript: { type: Type.STRING, description: "Valid python code using bpy module" }
          }
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text) as GeminiResponse;

  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};