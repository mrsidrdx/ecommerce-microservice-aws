const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/deleteTaxonomy/index");

describe("deleteTaxonomy Lambda function", () => {
  beforeEach(() => {
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      if (params.Key.TaxonomyId === "valid-id") {
        callback(null, {});
      } else {
        callback(null, {});
      }
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("should return 200 and success message when taxonomy is deleted", async () => {
    const event = { arguments: JSON.stringify({ TaxonomyId: "valid-id" }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      message: "Taxonomy deleted successfully",
    });
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "delete", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });
    const event = { arguments: JSON.stringify({ TaxonomyId: "valid-id" }) };
    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Could not delete taxonomy",
    });
  });
});
