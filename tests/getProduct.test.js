const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/getProduct/index");

describe("getProduct Lambda function", () => {
  beforeEach(() => {
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      if (params.Key.ProductId === "exist") {
        callback(null, {
          Item: { ProductId: "exist", Name: "Existing Product" },
        });
      } else {
        callback(null, {});
      }
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("should return 200 and product data when product exists", async () => {
    const event = { arguments: JSON.stringify({ ProductId: "exist" }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      __typename: "Product",
      ProductId: "exist",
      Name: "Existing Product",
    });
  });

  test("should return 404 when product does not exist", async () => {
    const event = { arguments: JSON.stringify({ ProductId: "nonexistent" }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({ __typename: 'APIError', error: "Product not found" });
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });
    const event = { arguments: JSON.stringify({ ProductId: "exist" }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      __typename: 'APIError',
      error: "Could not retrieve product",
    });
  });
});
