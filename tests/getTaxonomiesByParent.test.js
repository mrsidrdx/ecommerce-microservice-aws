const AWS = require("aws-sdk-mock");
const { handler } = require("../functions/getTaxonomiesByParent/index");

describe("getTaxonomiesByParent Lambda function", () => {
  beforeEach(() => {
    AWS.mock("DynamoDB.DocumentClient", "query", (params, callback) => {
      if (params.ExpressionAttributeValues[":parentId"] === "valid-parent-id") {
        callback(null, {
          Items: [
            { TaxonomyId: "taxonomy1", ParentId: "valid-parent-id" },
            { TaxonomyId: "taxonomy2", ParentId: "valid-parent-id" },
          ],
        });
      } else {
        callback(null, { Items: [] });
      }
    });
  });

  afterEach(() => {
    AWS.restore("DynamoDB.DocumentClient");
  });

  test("should return 200 and taxonomies when ParentId exists", async () => {
    const event = {
      arguments: JSON.stringify({ ParentId: "valid-parent-id" }),
    };
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([
      { TaxonomyId: "taxonomy1", ParentId: "valid-parent-id" },
      { TaxonomyId: "taxonomy2", ParentId: "valid-parent-id" },
    ]);
  });

  test("should return 200 and an empty array when no taxonomies match ParentId", async () => {
    const event = {
      arguments: JSON.stringify({ ParentId: "nonexistent-parent-id" }),
    };
    const result = await handler(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  test("should return 500 when an error occurs", async () => {
    AWS.restore("DynamoDB.DocumentClient");
    AWS.mock("DynamoDB.DocumentClient", "query", (params, callback) => {
      callback(new Error("DynamoDB error"));
    });
    const event = {
      arguments: JSON.stringify({ ParentId: "valid-parent-id" }),
    };
    const result = await handler(event);
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "Could not query taxonomies",
    });
  });
});
