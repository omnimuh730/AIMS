import { GraphQLClient, gql } from "graphql-request";

const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint);

interface GenerateContentArgs {
	prompt: string;
	systemInstruction?: string;
	temperature?: number;
	jsonOutput?: boolean;
	modelName?: string;
}

export const generateContent = async ({
	prompt,
	systemInstruction,
	temperature,
	jsonOutput,
	modelName,
}: GenerateContentArgs): Promise<string> => {
	const query = gql`
		query GenerateContent(
			$prompt: String!
			$systemInstruction: String
			$temperature: Float
			$jsonOutput: Boolean
			$modelName: String
		) {
			generateContent(
				prompt: $prompt
				systemInstruction: $systemInstruction
				temperature: $temperature
				jsonOutput: $jsonOutput
				modelName: $modelName
			)
		}
	`;

	const variables = {
		prompt,
		systemInstruction,
		temperature,
		jsonOutput,
		modelName,
	};
	console.log(variables);
	const data = await client.request<{ generateContent: string }>(
		query,
		variables,
	);
	console.log("sent data");
	return data.generateContent;
};
