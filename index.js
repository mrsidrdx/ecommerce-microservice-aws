require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const app = express();
app.use(bodyParser.json());

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = "Products";
const TAXONOMY_TABLE = "ProductTaxonomyAttributes";

// Product CRUD operations

app.post("/products", async (req, res) => {
  const { ProductId, Name, Description, Price, Category, Stock } = req.body;
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
    res
      .status(201)
      .json({ message: "Product created successfully", ProductId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Could not create product" });
  }
});

app.get("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
    },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      res.json(Item);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({ error: "Could not retrieve product" });
  }
});

app.put("/products/:productId", async (req, res) => {
  const { productId } = req.params;
  const { Name, Description, Price, Category, Stock } = req.body;
  const timestamp = new Date().toISOString();

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
    },
    UpdateExpression:
      "set #name = :name, Description = :description, Price = :price, Category = :category, Stock = :stock, UpdatedAt = :updatedAt",
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
    res.json(Attributes);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Could not update product" });
  }
});

app.delete("/products/:productId", async (req, res) => {
  const { productId } = req.params;

  const params = {
    TableName: PRODUCTS_TABLE,
    Key: {
      ProductId: productId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Could not delete product" });
  }
});

app.get("/products", async (req, res) => {
  const { Name, Category, Price, limit, lastKey } = req.query;

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

    res.json({
      products: result.Items,
      lastKey: result.LastEvaluatedKey
        ? JSON.stringify(result.LastEvaluatedKey)
        : null,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Could not retrieve products" });
  }
});

// Taxonomy CRUD operations

app.post("/taxonomies", async (req, res) => {
  const { TaxonomyId, Name, Description, ParentId, Type } = req.body;

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
    res
      .status(201)
      .json({ message: "Taxonomy created successfully", TaxonomyId });
  } catch (error) {
    console.error("Error creating taxonomy:", error);
    res.status(500).json({ error: "Could not create taxonomy" });
  }
});

app.get("/taxonomies/:taxonomyId", async (req, res) => {
  const { taxonomyId } = req.params;

  const params = {
    TableName: TAXONOMY_TABLE,
    Key: {
      TaxonomyId: taxonomyId,
    },
  };

  try {
    const { Item } = await dynamodb.get(params).promise();
    if (Item) {
      res.json(Item);
    } else {
      res.status(404).json({ error: "Taxonomy not found" });
    }
  } catch (error) {
    console.error("Error retrieving taxonomy:", error);
    res.status(500).json({ error: "Could not retrieve taxonomy" });
  }
});

app.put("/taxonomies/:taxonomyId", async (req, res) => {
  const { taxonomyId } = req.params;
  const { Name, Description, ParentId, Type } = req.body;

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
    res.json(Attributes);
  } catch (error) {
    console.error("Error updating taxonomy:", error);
    res.status(500).json({ error: "Could not update taxonomy" });
  }
});

app.delete("/taxonomies/:taxonomyId", async (req, res) => {
  const { taxonomyId } = req.params;

  const params = {
    TableName: TAXONOMY_TABLE,
    Key: {
      TaxonomyId: taxonomyId,
    },
  };

  try {
    await dynamodb.delete(params).promise();
    res.json({ message: "Taxonomy deleted successfully" });
  } catch (error) {
    console.error("Error deleting taxonomy:", error);
    res.status(500).json({ error: "Could not delete taxonomy" });
  }
});

// Query taxonomies by ParentId (using GSI)
app.get("/taxonomies/parent/:parentId", async (req, res) => {
  const { parentId } = req.params;

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
    res.json(Items);
  } catch (error) {
    console.error("Error querying taxonomies by ParentId:", error);
    res.status(500).json({ error: "Could not query taxonomies" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
