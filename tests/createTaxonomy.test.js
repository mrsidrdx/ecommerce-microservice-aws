const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/createTaxonomy/index");

describe("createTaxonomy Lambda function", () => {
  beforeEach(() => {
    process.env.TAXONOMY_TABLE = "TestTaxonomyTable";
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(null, {});
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.TAXONOMY_TABLE;
  });

  test("should create a taxonomy successfully", async () => {
    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Test Taxonomy",
        Description: "A test taxonomy",
        ParentId: "parent123",
        Type: "Category",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    const body = JSON.parse(result.body);
    expect(body.message).toBe("Taxonomy created successfully");
    expect(body.TaxonomyId).toBe("123");
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Test Taxonomy",
        Description: "A test taxonomy",
        ParentId: "parent123",
        Type: "Category",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not create taxonomy");
  });

  test("should use correct put parameters", async () => {
    let capturedParams;
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      capturedParams = params;
      callback(null, {});
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Test Taxonomy",
        Description: "A test taxonomy",
        ParentId: "parent123",
        Type: "Category",
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestTaxonomyTable");
    expect(capturedParams.Item).toEqual({
      TaxonomyId: "123",
      Name: "Test Taxonomy",
      Description: "A test taxonomy",
      ParentId: "parent123",
      Type: "Category",
    });
  });

  test("should handle missing optional fields", async () => {
    let capturedParams;
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "put", (params, callback) => {
      capturedParams = params;
      callback(null, {});
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Test Taxonomy",
        Type: "Category",
      }),
    };

    await handler(event);

    expect(capturedParams.Item).toEqual({
      TaxonomyId: "123",
      Name: "Test Taxonomy",
      Type: "Category",
    });
    expect(capturedParams.Item.Description).toBeUndefined();
    expect(capturedParams.Item.ParentId).toBeUndefined();
  });
});
