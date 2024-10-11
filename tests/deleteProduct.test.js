const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/deleteProduct/index");

describe("deleteProduct Lambda function", () => {
  beforeEach(() => {
    process.env.PRODUCTS_TABLE = "TestProductsTable";
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      if (params.Key.ProductId === undefined) {
        callback(new Error("ProductId is required"));
      }
      callback(null, {});
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.PRODUCTS_TABLE;
  });

  test("should delete a product successfully", async () => {
    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe("Product deleted successfully");
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not delete product");
  });

  test("should use correct delete parameters", async () => {
    let capturedParams;
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      capturedParams = params;
      callback(null, {});
    });

    const event = {
      arguments: JSON.stringify({
        ProductId: "123",
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestProductsTable");
    expect(capturedParams.Key).toEqual({ ProductId: "123" });
  });

  test("should handle missing ProductId", async () => {
    const event = {
      arguments: JSON.stringify({}),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not delete product");
  });
});
