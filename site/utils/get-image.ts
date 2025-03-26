import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import * as fs from "node:fs/promises"; // Use fs/promises for Deno compatibility
import * as mime from "npm:mime-types";
import { Buffer } from "node:buffer";
import * as path from "node:path";

const apiKey = Deno.env.get("GEMINI_API_KEY");
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: ["image", "text"],
  responseMimeType: "text/plain",
};

/**
 * Generates an image based on the provided prompt and saves it with the prompt as the filename
 * @param prompt The text prompt to generate the image
 * @param outputDir Optional directory to save the image (defaults to current directory)
 * @returns The path to the saved image file
 */
async function generateImageFromPrompt(
  prompt: string,
  outputDir: string = "./",
) {
  console.log(`Generating image for prompt: "${prompt}"...`);

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{
          text:
            "generate an professional square image of an product with white background",
        }],
      },
    ],
  });

  const result = await chatSession.sendMessage(prompt);
  const candidates = result.response?.candidates;

  // Create a safe filename from the prompt
  const safePrompt = prompt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  let savedFilePath = "";

  for (let candidate of candidates || []) {
    for (let part of candidate?.content?.parts || []) {
      if (part?.inlineData) {
        try {
          const extension = mime.extension(part.inlineData.mimeType) || "png";
          const filename = `${safePrompt}.${extension}`;
          const filePath = path.join(outputDir, filename);

          await fs.writeFile(
            filePath,
            new Uint8Array(Buffer.from(part.inlineData.data, "base64")),
          );

          console.log(`Image saved to: ${filePath}`);
          savedFilePath = filePath;
        } catch (err) {
          console.error("Error saving image:", err);
          throw err;
        }
      }
    }
  }

  if (result.response.text) {
    console.log("AI response:", result.response.text());
  }

  return savedFilePath;
}

// Get prompt from command line arguments
const args = Deno.args;

if (args.length === 0) {
  console.log('Usage: deno run -A get-image.ts "your image prompt here"');
  Deno.exit(1);
}

// Use the first argument as the prompt
const prompt = args[0];

// Optional second argument for output directory
const outputDir = args[1] || "./";

// Generate the image
const filePath = await generateImageFromPrompt(prompt, outputDir);

if (filePath) {
  console.log("Done! Image saved at:", filePath);
} else {
  console.error("Error generating image");
  Deno.exit(1);
}
