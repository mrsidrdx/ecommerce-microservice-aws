const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { ProductId } = JSON.parse(event.arguments || {});

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      ProductId: ProductId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ __typename: "DeleteResponse", message: "Product deleted successfully" }),
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ __typename: 'APIError', error: "Could not delete product" }),
    };
  }
};
