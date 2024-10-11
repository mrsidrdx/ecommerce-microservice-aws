const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { ParentId } = JSON.parse(event.arguments || {});

  const params = {
    TableName: process.env.TAXONOMY_TABLE,
    IndexName: "ParentIndex",
    KeyConditionExpression: "ParentId = :parentId",
    ExpressionAttributeValues: {
      ":parentId": ParentId,
    },
  };

  try {
    const { Items } = await dynamodb.query(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Items),
    };
  } catch (error) {
    console.error("Error querying taxonomies by ParentId:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not query taxonomies" }),
    };
  }
};
