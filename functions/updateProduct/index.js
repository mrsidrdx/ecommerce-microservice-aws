const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { ProductId, Name, Description, Price, Category, Stock } = JSON.parse(
    event.arguments || {}
  );
  const timestamp = new Date().toISOString();

  const params = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {
      ProductId: ProductId,
    },
    UpdateExpression:
      "SET #name = :name, Description = :description, Price = :price, Category = :category, Stock = :stock, UpdatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#name": "Name",
    },
    ExpressionAttributeValues: {
      ":name": Name,
      ":description": Description,
      ":price": Price,
      ":category": Category,
      ":stock": Stock,
      ":updatedAt": timestamp,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const { Attributes } = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(Attributes),
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not update product" }),
    };
  }
};
