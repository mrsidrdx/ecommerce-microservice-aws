const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('Processing event:', event);
  const { ProductId } = event.pathParameters || {};

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
      body: JSON.stringify(Item),
    };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found' }),
      };
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not retrieve product' }),
    };
  }
};
