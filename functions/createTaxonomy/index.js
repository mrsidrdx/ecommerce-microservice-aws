const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { TaxonomyId, Name, Description, ParentId, Type } = JSON.parse(
    event.arguments || {}
  );

  const params = {
    TableName: process.env.TAXONOMY_TABLE,
    Item: {
      TaxonomyId,
      Name,
      Description,
      ParentId,
      Type,
    },
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        __typename: "CreateTaxonomySuccess",
        message: "Taxonomy created successfully",
        TaxonomyId,
      }),
    };
  } catch (error) {
    console.error("Error creating taxonomy:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ __typename: 'APIError', error: "Could not create taxonomy" }),
    };
  }
};
