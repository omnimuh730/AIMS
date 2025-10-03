
import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'http://localhost:4000/graphql';
const client = new GraphQLClient(endpoint);

export const generateContent = async (prompt) => {
  const query = gql`
    query GenerateContent($prompt: String!) {
      generateContent(prompt: $prompt)
    }
  `;

  const variables = { prompt };
  const data = await client.request(query, variables);
  return data.generateContent;
};
