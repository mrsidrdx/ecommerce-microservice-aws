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
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        body: JSON.stringify(Item),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Taxonomy not found" }),
      };
    }
  } catch (error) {
    console.error("Error retrieving taxonomy:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve taxonomy" }),
    };
  }
};
