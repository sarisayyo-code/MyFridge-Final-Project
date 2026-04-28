import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini client using the injected process.env key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateRecipesFromInventory(inventoryItems) {
  if (!inventoryItems || inventoryItems.length === 0) return [];
  
  const prompt = `You are an expert chef assistant. Given the following list of ingredients from a user's fridge/pantry, generate 3 relevant recipe ideas.
  
  Inventory: ${inventoryItems.join(', ')}

  Provide your response as a JSON array where each item is a recipe object with the exact following schema:
  [
    {
      "title": "String",
      "time": "String (e.g. 20 min)",
      "difficulty": "Easy" | "Medium" | "Hard",
      "ingredients": ["String list of ingredients, prioritize ones in the inventory, but can add a few common ones missing"],
      "instructions": ["String array of step-by-step instructions (short and concise)"]
    }
  ]
  
  Only output valid JSON array, do not wrap it in markdown code blocks or add any other text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
  } catch (error) {
    console.error("Gemini Recipe Generation failed: ", error);
  }
  return [];
}
