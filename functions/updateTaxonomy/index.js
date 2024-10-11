const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const { TaxonomyId, Name, Description, ParentId, Type } = JSON.parse(
    event.arguments || {}
  );

  const params = {
    TableName: process.env.TAXONOMY_TABLE,
    Key: {
      TaxonomyId: TaxonomyId,
    },
    UpdateExpression:
      "set #name = :name, Description = :description, ParentId = :parentId, #type = :type",
    ExpressionAttributeNames: {
      "#name": "Name",
      "#type": "Type",
    },
    ExpressionAttributeValues: {
      ":name": Name,
      ":description": Description,
      ":parentId": ParentId,
      ":type": Type,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const { Attributes } = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        __typename: "Taxonomy",
        ...Attributes,
      }),
    };
  } catch (error) {
    console.error("Error updating taxonomy:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        __typename: "APIError",
        error: "Could not update taxonomy",
      }),
    };
  }
};
