const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { ProductId, Name, Description, Price, Category, Stock } = JSON.parse(
    event.arguments || {}
  );
  const timestamp = new Date().toISOString();

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      ProductId,
      Name,
      Description,
      Price,
      Category,
      Stock,
      CreatedAt: timestamp,
      UpdatedAt: timestamp,
    },
  };

  try {
    await dynamodb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Product created successfully",
        ProductId,
      }),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not create product" }),
    };
  }
};
