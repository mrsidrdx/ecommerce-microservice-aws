const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/updateProduct/index");

describe("updateProduct Lambda function", () => {
  beforeEach(() => {
    process.env.PRODUCTS_TABLE = "TestProductsTable";
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      callback(null, {
        Attributes: {
          ProductId: params.Key.ProductId,
          Name: params.ExpressionAttributeValues[":name"],
          Description: params.ExpressionAttributeValues[":description"],
          Price: params.ExpressionAttributeValues[":price"],
          Category: params.ExpressionAttributeValues[":category"],
          Stock: params.ExpressionAttributeValues[":stock"],
          UpdatedAt: params.ExpressionAttributeValues[":updatedAt"],
        },
      });
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.PRODUCTS_TABLE;
  });

  test("should update a product successfully", async () => {
    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Updated Product",
        Description: "An updated test product",
        Price: 29.99,
        Category: "UpdatedTest",
        Stock: 200,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.ProductId).toBe("123");
    expect(body.Name).toBe("Updated Product");
    expect(body.Description).toBe("An updated test product");
    expect(body.Price).toBe(29.99);
    expect(body.Category).toBe("UpdatedTest");
    expect(body.Stock).toBe(200);
    expect(body.UpdatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Updated Product",
        Description: "An updated test product",
        Price: 29.99,
        Category: "UpdatedTest",
        Stock: 200,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not update product");
  });

  test("should use correct update expression and attribute names", async () => {
    let capturedParams;
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      capturedParams = params;
      callback(null, { Attributes: {} });
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Updated Product",
        Description: "An updated test product",
        Price: 29.99,
        Category: "UpdatedTest",
        Stock: 200,
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestProductsTable");
    expect(capturedParams.Key).toEqual({ ProductId: "123" });
    expect(capturedParams.UpdateExpression).toBe(
      "SET #name = :name, Description = :description, Price = :price, Category = :category, Stock = :stock, UpdatedAt = :updatedAt"
    );
    expect(capturedParams.ExpressionAttributeNames).toEqual({
      "#name": "Name",
    });
    expect(capturedParams.ExpressionAttributeValues).toMatchObject({
      ":name": "Updated Product",
      ":description": "An updated test product",
      ":price": 29.99,
      ":category": "UpdatedTest",
      ":stock": 200,
    });
    expect(capturedParams.ExpressionAttributeValues[":updatedAt"]).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
    expect(capturedParams.ReturnValues).toBe("ALL_NEW");
  });
});
