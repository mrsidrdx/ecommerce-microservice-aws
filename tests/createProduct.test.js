const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/createProduct/index");

describe("createProduct Lambda function", () => {
  beforeEach(() => {
    process.env.PRODUCTS_TABLE = "TestProductsTable";
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.PRODUCTS_TABLE;
  });

  test("should create a product successfully", async () => {
    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Test Product",
        Description: "A test product",
        Price: 19.99,
        Category: "Test",
        Stock: 100,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe("Product created successfully");
    expect(body.ProductId).toBe("123");
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Test Product",
        Description: "A test product",
        Price: 19.99,
        Category: "Test",
        Stock: 100,
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not create product");
  });

  test("should include timestamp fields in the created item", async () => {
    let capturedParams;
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      capturedParams = params;
      callback(null, {});
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
        Name: "Test Product",
        Description: "A test product",
        Price: 19.99,
        Category: "Test",
        Stock: 100,
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestProductsTable");
    expect(capturedParams.Item).toHaveProperty("CreatedAt");
    expect(capturedParams.Item).toHaveProperty("UpdatedAt");
    expect(capturedParams.Item.CreatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
    expect(capturedParams.Item.UpdatedAt).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });
});
