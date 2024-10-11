const AWS = require("aws-sdk");

exports.handler = async (event) => {
  console.log("Processing event:", event);
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { ProductId } = JSON.parse(event.arguments || {});

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      ProductId: ProductId,
    },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          __typename: "Product",
          ...Item,
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ __typename: 'APIError', error: "Product not found" }),
      };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ __typename: 'APIError', error: "Could not retrieve product" }),
    };
  }
};
