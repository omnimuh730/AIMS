// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import { GoogleGenAI, Type } from "@google/genai";

const ActionPlanSchema = {
	type: "object",
	properties: {
		ActionPlan: {
			type: "object",
			properties: {
				goal: {
					type: "string",
				},
				element_manifest: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string",
							},
							type: {
								type: "string",
							},
							description: {
								type: "string",
							},
							confidence: {
								type: "integer",
							},
							suggested_selector: {
								type: "string",
							},
						},
						propertyOrdering: [
							"id",
							"type",
							"description",
							"confidence",
							"suggested_selector",
						],
						required: [
							"id",
							"type",
							"description",
							"confidence",
							"suggested_selector",
						],
					},
				},
				steps: {
					type: "array",
					items: {
						type: "object",
						properties: {
							step_id: {
								type: "integer",
							},
							description: {
								type: "string",
							},
							actions: {
								type: "array",
								items: {
									type: "object",
									properties: {
										type: {
											type: "string",
										},
										target_id: {
											type: "string",
										},
										value: {
											type: "string",
										},
									},
									propertyOrdering: [
										"type",
										"target_id",
										"value",
									],
									required: ["type", "target_id", "value"],
								},
							},
						},
						propertyOrdering: ["step_id", "description", "actions"],
						required: ["step_id", "description", "actions"],
					},
				},
			},
			propertyOrdering: ["goal", "element_manifest", "steps"],
			required: ["goal", "element_manifest", "steps"],
		},
	},
	propertyOrdering: ["ActionPlan"],
	required: ["ActionPlan"],
};

async function core_process(
	systemInstruction_Prompt = "",
	userInput_Prompt = "",
	outputSchema_Prompt = ActionPlanSchema
) {
	/*
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY,
	});
	const config = {
		thinkingConfig: {
			thinkingBudget: -1,
		},
		responseMimeType: "application/json",
		responseSchema: outputSchema_Prompt,
		systemInstruction: [
			{
				text: systemInstruction_Prompt,
			},
		],
	};
	const model = "gemini-2.5-pro";
	const contents = [
		{
			role: "user",
			parts: [
				{
					text: userInput_Prompt,
				},
			],
		},
	];

	const response = await ai.models.generateContent(model, config, contents);
	console.log("response is", response);

	return response;
	*/
	const ai = new GoogleGenAI({
		apiKey: process.env.GEMINI_API_KEY,
	});
	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: userInput_Prompt,
		config: {
			responseMimeType: "application/json",
			systemInstruction: systemInstruction_Prompt,
			responseSchema: outputSchema_Prompt,
		},
	});
	return response.text;
}

export { core_process };
