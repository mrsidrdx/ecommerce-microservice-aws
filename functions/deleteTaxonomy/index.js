const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { TaxonomyId } = JSON.parse(event.arguments || {});

  const params = {
    TableName: process.env.TAXONOMY_TABLE,
    Key: {
      TaxonomyId: TaxonomyId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ __typename: "DeleteResponse", message: "Taxonomy deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting taxonomy:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ __typename: 'APIError', error: "Could not delete taxonomy" }),
    };
  }
};
