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
      prompt: String!,
      systemInstruction: String,
      temperature: Float,
      jsonOutput: Boolean
	  modelName: String
    ): String
  }
`);

interface GenerateContentArgs {
	prompt: string;
	systemInstruction?: string;
	temperature?: number;
	jsonOutput?: boolean;
	modelName?: string;
}

// The root provides a resolver function for each API endpoint
const root = {
	generateContent: async ({
		prompt,
		systemInstruction,
		temperature,
		jsonOutput,
		modelName,
	}: GenerateContentArgs) => {
		try {
			console.log("Start thinking...");
			const generationConfig: GenerationConfig = {
				temperature: temperature ?? 1, // Default temperature
				responseMimeType: jsonOutput
					? "application/json"
					: "text/plain",
			};

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
app.all("/graphql", createHandler({ schema, rootValue: root }));

app.listen(4000, () => {
	console.log(
		"Running a GraphQL API server at http://localhost:4000/graphql"
	);
});
