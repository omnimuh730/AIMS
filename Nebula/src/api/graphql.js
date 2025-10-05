
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';
const client = new GraphQLClient(endpoint);

export const generateContent = async ({
	prompt,
	systemInstruction,
	temperature,
	jsonOutput,
}) => {
	const query = gql`
    query GenerateContent(
      $prompt: String!,
      $systemInstruction: String,
      $temperature: Float,
      $jsonOutput: Boolean,
    ) {
      generateContent(
        prompt: $prompt,
        systemInstruction: $systemInstruction,
        temperature: $temperature,
        jsonOutput: $jsonOutput,
      )
    }
  `;

	const variables = {
		prompt,
		systemInstruction,
		temperature,
		jsonOutput,
	};
	const data = await client.request(query, variables);
	return data.generateContent;
};
