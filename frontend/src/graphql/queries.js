// @flow
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($ProductId: ID!) {
    getProduct(ProductId: $ProductId) {
      ... on Product {
        ProductId
        Name
        Description
        Price
        Category
        Stock
        CreatedAt
        UpdatedAt
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const getTaxonomy = /* GraphQL */ `
  query GetTaxonomy($TaxonomyId: ID!) {
    getTaxonomy(TaxonomyId: $TaxonomyId) {
      ... on Taxonomy {
        TaxonomyId
        Name
        Description
        ParentId
        Type
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const getTaxonomiesByParent = /* GraphQL */ `
  query GetTaxonomiesByParent($ParentId: ID!) {
    getTaxonomiesByParent(ParentId: $ParentId) {
      ... on TaxonomyList {
        taxonomies {
          TaxonomyId
          Name
          Description
          ParentId
          Type
          __typename
        }
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const getProducts = /* GraphQL */ `
  query GetProducts(
    $Name: String
    $Category: String
    $Price: Float
    $limit: Int
    $lastKey: String
  ) {
    getProducts(
      Name: $Name
      Category: $Category
      Price: $Price
      limit: $limit
      lastKey: $lastKey
    ) {
      ... on ProductsList {
        products {
          ProductId
          Name
          Description
          Price
          Category
          Stock
          CreatedAt
          UpdatedAt
          __typename
        }
        lastKey
      }
      ... on APIError {
        error
      }
    }
  }
`;
