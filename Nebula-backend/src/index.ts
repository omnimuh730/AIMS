import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import { buildSchema } from "graphql";
import cors from "cors";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
	throw new Error("GEMINI_API_KEY environment variable not set");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    generateContent(
      prompt: String!
      systemInstruction: String
      temperature: Float
      jsonOutput: Boolean
      modelName: String
      responseSchema: String
    ): String
  }
`);

interface GenerateContentArgs {
	prompt: string;
	systemInstruction?: string;
	temperature?: number;
	jsonOutput?: boolean;
	modelName?: string;
  responseSchema?: string;
}

// The root provides a resolver function for each API endpoint
const root = {
	generateContent: async ({
		prompt,
		systemInstruction,
		temperature,
		jsonOutput,
		modelName,
		responseSchema,
	}: GenerateContentArgs) => {
		try {
			console.log("Start thinking...");
			const generationConfig: GenerationConfig = {
				temperature: temperature ?? 1,
				responseMimeType: jsonOutput ? "application/json" : "text/plain",
				// Only apply structured schema when provided and JSON output is enabled
				...(jsonOutput && typeof responseSchema === "string"
					? (() => {
						try {
							return { responseSchema: JSON.parse(responseSchema as string) } as unknown as GenerationConfig;
						} catch (e) {
							console.warn("Invalid responseSchema JSON, ignoring.");
							return {} as GenerationConfig;
						}
					})()
				: {}),
			} as GenerationConfig;

			const model = genAI.getGenerativeModel({
				model: modelName ?? "gemini-pro",
				systemInstruction: systemInstruction,
				generationConfig,
			});

			console.log(model);

			const result = await model.generateContent(prompt);
			const response = await result.response;
			const text = response.text();

			console.log("Finished thinking.");

			return text;
		} catch (error) {
			console.error("Error generating content:", error);
			return "Error generating content. Please check the server logs.";
		}
	},
};

const app = express();
app.use(cors());
// Handle CORS preflight explicitly for our REST route (avoid '*' with Express 5 path-to-regexp)
app.options("/generate", cors());
app.use(express.json());
app.all("/graphql", createHandler({ schema, rootValue: root }));

// REST endpoint alternative to GraphQL
app.post("/generate", async (req, res) => {
  try {
    const {
      prompt,
      systemInstruction,
      temperature,
      jsonOutput,
      modelName,
      responseSchema,
    } = (req.body ?? {}) as {
      prompt?: string;
      systemInstruction?: string;
      temperature?: number;
      jsonOutput?: boolean;
      modelName?: string;
      responseSchema?: unknown;
    };

    console.log("POST /generate", {
      hasPrompt: typeof prompt === "string" && prompt.length > 0,
      modelName,
      jsonOutput,
      schemaType: responseSchema === null ? "null" : typeof responseSchema,
    });

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "prompt is required" });
    }

    const generationConfig: GenerationConfig = {
      temperature: typeof temperature === "number" ? temperature : 1,
      responseMimeType: jsonOutput ? "application/json" : "text/plain",
      ...(jsonOutput
        ? (() => {
            try {
              let schemaObj: unknown = undefined;
              if (typeof responseSchema === "string" && responseSchema.trim() !== "") {
                schemaObj = JSON.parse(responseSchema);
              } else if (responseSchema && typeof responseSchema === "object") {
                schemaObj = responseSchema;
              }
              return schemaObj ? ({ responseSchema: schemaObj } as unknown as GenerationConfig) : ({} as GenerationConfig);
            } catch (e) {
              console.warn("Invalid responseSchema JSON, ignoring.");
              return {} as GenerationConfig;
            }
          })()
        : {}),
    } as GenerationConfig;

    const model = genAI.getGenerativeModel({
      model: modelName ?? "gemini-pro",
      systemInstruction,
      generationConfig,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res
      .type(jsonOutput ? "application/json" : "text/plain")
      .status(200)
      .send(text);
  } catch (error) {
    console.error("/generate error:", error);
    res.status(500).json({ error: "Error generating content" });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Nebula-backend listening on http://localhost:${PORT}`);
  console.log(`GraphQL at /graphql, REST at /generate`);
});
