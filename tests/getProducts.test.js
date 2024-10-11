const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/getProducts/index");

describe("getProducts Lambda function", () => {
  beforeEach(() => {
    process.env.PRODUCTS_TABLE = "TestProductsTable";
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.PRODUCTS_TABLE;
  });

  test("should fetch products without filters", async () => {
    const mockItems = [
      { ProductId: "1", Name: "Product 1", Category: "Category A", Price: 10 },
      { ProductId: "2", Name: "Product 2", Category: "Category B", Price: 20 },
    ];

    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      callback(null, { Items: mockItems });
    });

    const event = { arguments: JSON.stringify({}) };
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.products).toEqual(mockItems);
    expect(body.lastKey).toBeNull();
  });

  test("should fetch products with filters", async () => {
    const mockItems = [
      { ProductId: "1", Name: "Test Product", Category: "Test", Price: 15 },
    ];

    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      expect(params.FilterExpression).toBe(
        "#name = :name AND Category = :category AND Price = :price"
      );
      expect(params.ExpressionAttributeNames).toEqual({ "#name": "Name" });
      expect(params.ExpressionAttributeValues).toEqual({
        ":name": "Test Product",
        ":category": "Test",
        ":price": 15,
      });
      callback(null, { Items: mockItems });
    });

    const event = {
      arguments: JSON.stringify({
        Name: "Test Product",
        Category: "Test",
        Price: "15",
      }),
    };
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.products).toEqual(mockItems);
  });

  test("should handle pagination", async () => {
    const mockItems = [{ ProductId: "1", Name: "Product 1" }];
    const mockLastKey = { ProductId: "1" };

    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      expect(params.Limit).toBe(5);
      expect(params.ExclusiveStartKey).toEqual({ ProductId: "lastKey" });
      callback(null, { Items: mockItems, LastEvaluatedKey: mockLastKey });
    });

    const event = {
      arguments: JSON.stringify({
        limit: "5",
        lastKey: JSON.stringify({ ProductId: "lastKey" }),
      }),
    };
    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.products).toEqual(mockItems);
    expect(body.lastKey).toBe(JSON.stringify(mockLastKey));
  });

  test("should handle errors", async () => {
    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = { arguments: JSON.stringify({}) };
    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not retrieve products");
  });

  test("should use default limit when not provided", async () => {
    AWS.mock("DynamoDB.DocumentClient", "scan", (params, callback) => {
      expect(params.Limit).toBe(10);
      callback(null, { Items: [] });
    });

    const event = { arguments: JSON.stringify({}) };
    await handler(event);
  });
});
