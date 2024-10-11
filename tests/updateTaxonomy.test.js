const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/updateTaxonomy/index");

describe("updateTaxonomy Lambda function", () => {
  beforeEach(() => {
    process.env.TAXONOMY_TABLE = "TestTaxonomyTable";
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
    delete process.env.TAXONOMY_TABLE;
  });

  test("should update a taxonomy successfully", async () => {
    const mockUpdatedItem = {
      TaxonomyId: "123",
      Name: "Updated Taxonomy",
      Description: "An updated test taxonomy",
      ParentId: "newParent456",
      Type: "UpdatedCategory",
    };

    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      callback(null, { Attributes: mockUpdatedItem });
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Updated Taxonomy",
        Description: "An updated test taxonomy",
        ParentId: "newParent456",
        Type: "UpdatedCategory",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body).toEqual(mockUpdatedItem);
  });

  test("should return 500 when an error occurs", async () => {
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Updated Taxonomy",
        Description: "An updated test taxonomy",
        ParentId: "newParent456",
        Type: "UpdatedCategory",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not update taxonomy");
  });

  test("should use correct update parameters", async () => {
    let capturedParams;
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      capturedParams = params;
      callback(null, { Attributes: {} });
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Updated Taxonomy",
        Description: "An updated test taxonomy",
        ParentId: "newParent456",
        Type: "UpdatedCategory",
      }),
    };

    await handler(event);

    expect(capturedParams.TableName).toBe("TestTaxonomyTable");
    expect(capturedParams.Key).toEqual({ TaxonomyId: "123" });
    expect(capturedParams.UpdateExpression).toBe(
      "set #name = :name, Description = :description, ParentId = :parentId, #type = :type"
    );
    expect(capturedParams.ExpressionAttributeNames).toEqual({
      "#name": "Name",
      "#type": "Type",
    });
    expect(capturedParams.ExpressionAttributeValues).toEqual({
      ":name": "Updated Taxonomy",
      ":description": "An updated test taxonomy",
      ":parentId": "newParent456",
      ":type": "UpdatedCategory",
    });
    expect(capturedParams.ReturnValues).toBe("ALL_NEW");
  });

  test("should handle missing optional fields", async () => {
    let capturedParams;
    AWS.mock("DynamoDB.DocumentClient", "update", (params, callback) => {
      capturedParams = params;
      callback(null, { Attributes: {} });
    });

    const event = {
      arguments: JSON.stringify({
        TaxonomyId: "123",
        Name: "Updated Taxonomy",
        Type: "UpdatedCategory",
      }),
    };

    await handler(event);

    expect(
      capturedParams.ExpressionAttributeValues[":description"]
    ).toBeUndefined();
    expect(
      capturedParams.ExpressionAttributeValues[":parentId"]
    ).toBeUndefined();
  });

  test("should handle missing TaxonomyId", async () => {
    const event = {
      arguments: JSON.stringify({
        Name: "Updated Taxonomy",
        Description: "An updated test taxonomy",
        ParentId: "newParent456",
        Type: "UpdatedCategory",
      }),
    };

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    const body = JSON.parse(result.body);
    expect(body.error).toBe("Could not update taxonomy");
  });
});
