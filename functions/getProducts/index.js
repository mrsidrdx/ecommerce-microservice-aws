const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { Name, Category, Price, limit, lastKey } = JSON.parse(
    event.arguments || {}
  );

  let params = {
    TableName: process.env.PRODUCTS_TABLE,
    Limit: limit ? parseInt(limit) : 10,
  };

  let filterExpressions = [];
  let expressionAttributeNames = {};
  let expressionAttributeValues = {};

  if (Name) {
    filterExpressions.push("#name = :name");
    expressionAttributeNames["#name"] = "Name";
    expressionAttributeValues[":name"] = Name;
  }

  if (Category) {
    filterExpressions.push("Category = :category");
    expressionAttributeValues[":category"] = Category;
  }

  if (Price) {
    filterExpressions.push("Price = :price");
    expressionAttributeValues[":price"] = parseFloat(Price);
  }

  if (filterExpressions.length > 0) {
    params.FilterExpression = filterExpressions.join(" AND ");
    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }
    params.ExpressionAttributeValues = expressionAttributeValues;
  }

  if (lastKey) {
    params.ExclusiveStartKey = JSON.parse(lastKey);
  }

  try {
    const result = await dynamodb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        products: result.Items,
        lastKey: result.LastEvaluatedKey
          ? JSON.stringify(result.LastEvaluatedKey)
          : null,
      }),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Could not retrieve products" }),
    };
  }
};
