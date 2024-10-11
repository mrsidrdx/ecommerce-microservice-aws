const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = "Products";
const TAXONOMY_TABLE = "ProductTaxonomyAttributes";

// Helper function to send response
const sendResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
};

// Product operations
exports.createProduct = async (event) => {
  const { ProductId, Name, Description, Price, Category, Stock } = JSON.parse(
    event.body
  );
  const timestamp = new Date().toISOString();

  const params = {
    TableName: PRODUCTS_TABLE,
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
    return sendResponse(201, {
      message: "Product created successfully",
      ProductId,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return sendResponse(500, { error: "Could not create product" });
  }
};

exports.getProduct = async (event) => {
  const { productId } = event.pathParameters;

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
    },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return sendResponse(200, Item);
    } else {
      return sendResponse(404, { error: "Product not found" });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    return sendResponse(500, { error: "Could not retrieve product" });
  }
};

exports.updateProduct = async (event) => {
  const { productId } = event.pathParameters;
  const { Name, Description, Price, Category, Stock } = JSON.parse(event.body);
  const timestamp = new Date().toISOString();

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
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
    return sendResponse(200, Attributes);
  } catch (error) {
    console.error("Error updating product:", error);
    return sendResponse(500, { error: "Could not update product" });
  }
};

exports.deleteProduct = async (event) => {
  const { productId } = event.pathParameters;

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    return sendResponse(200, { message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return sendResponse(500, { error: "Could not delete product" });
  }
};

exports.getProducts = async (event) => {
  const { Name, Category, Price, limit, lastKey } = event.queryStringParameters;

  let params = {
    TableName: PRODUCTS_TABLE,
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

  // Only add FilterExpression if filters exist
  if (filterExpressions.length > 0) {
    params.FilterExpression = filterExpressions.join(" AND ");
    if (Object.keys(expressionAttributeNames).length > 0) {
      params.ExpressionAttributeNames = expressionAttributeNames;
    }
    params.ExpressionAttributeValues = expressionAttributeValues;
  }

  // Pagination: If `lastKey` is provided, set `ExclusiveStartKey` for pagination
  if (lastKey) {
    params.ExclusiveStartKey = JSON.parse(lastKey);
  }

  try {
    const result = await dynamodb.scan(params).promise();

    return sendResponse(200, {
      products: result.Items,
      lastKey: result.LastEvaluatedKey
        ? JSON.stringify(result.LastEvaluatedKey)
        : null,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return sendResponse(500, { error: "Could not retrieve products" });
  }
};

// Taxonomy operations
exports.createTaxonomy = async (event) => {
  const { TaxonomyId, Name, Description, ParentId, Type } = JSON.parse(
    event.body
  );

  const params = {
    TableName: TAXONOMY_TABLE,
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
    return sendResponse(201, {
      message: "Taxonomy created successfully",
      TaxonomyId,
    });
  } catch (error) {
    console.error("Error creating taxonomy:", error);
    return sendResponse(500, { error: "Could not create taxonomy" });
  }
};

exports.getTaxonomy = async (event) => {
  const { taxonomyId } = event.pathParameters;

  const params = {
    TableName: TAXONOMY_TABLE,
    Key: {
      TaxonomyId: taxonomyId,
    },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      return sendResponse(200, Item);
    } else {
      return sendResponse(404, { error: "Taxonomy not found" });
    }
  } catch (error) {
    console.error("Error retrieving taxonomy:", error);
    return sendResponse(500, { error: "Could not retrieve taxonomy" });
  }
};

exports.updateTaxonomy = async (event) => {
  const { taxonomyId } = event.pathParameters;
  const { Name, Description, ParentId, Type } = JSON.parse(event.body);

  const params = {
    TableName: TAXONOMY_TABLE,
    Key: {
      TaxonomyId: taxonomyId,
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
    return sendResponse(200, Attributes);
  } catch (error) {
    console.error("Error updating taxonomy:", error);
    return sendResponse(500, { error: "Could not update taxonomy" });
  }
};

exports.deleteTaxonomy = async (event) => {
  const { taxonomyId } = event.pathParameters;

  const params = {
    TableName: TAXONOMY_TABLE,
    Key: {
      TaxonomyId: taxonomyId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    return sendResponse(200, { message: "Taxonomy deleted successfully" });
  } catch (error) {
    console.error("Error deleting taxonomy:", error);
    return sendResponse(500, { error: "Could not delete taxonomy" });
  }
};

exports.getTaxonomiesByParent = async (event) => {
  const { parentId } = event.pathParameters;

  const params = {
    TableName: TAXONOMY_TABLE,
    IndexName: "ParentIndex",
    KeyConditionExpression: "ParentId = :parentId",
    ExpressionAttributeValues: {
      ":parentId": parentId,
    },
  };

  try {
    const { Items } = await dynamodb.query(params).promise();
    return sendResponse(200, Items);
  } catch (error) {
    console.error("Error querying taxonomies by ParentId:", error);
    return sendResponse(500, { error: "Could not query taxonomies" });
  }
};
