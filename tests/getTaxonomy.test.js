const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/getTaxonomy/index");

describe("getTaxonomy Lambda function", () => {
  beforeEach(() => {
    process.env.TAXONOMY_TABLE = "TestTaxonomyTable";
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.TAXONOMY_TABLE;
  });

  test("should retrieve a taxonomy successfully", async () => {
    const mockItem = {
      TaxonomyId: "123",
      Name: "Test Taxonomy",
      Description: "A test taxonomy",
      ParentId: "parent123",
      Type: "Category",
    };

    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(null, { Item: mockItem });
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toEqual({
      __typename: "Taxonomy",
      ...mockItem,
    });
  });

  test("should return 404 when taxonomy is not found", async () => {
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(null, {});
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "nonexistent",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(404);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Taxonomy not found");
  });

  test("should return 500 when an error occurs", async () => {
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not retrieve taxonomy");
  });

  test("should use correct get parameters", async () => {
    let capturedParams;
    AWS.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
      capturedParams = params;
      callback(null, { Item: {} });
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestTaxonomyTable");
    expect(capturedParams.Key).toEqual({
      TaxonomyId: "123",
    });
  });

  test("should handle missing TaxonomyId", async () => {
    const event = {
      arguments: JSON.stringify({}),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not retrieve taxonomy");
  });
});
