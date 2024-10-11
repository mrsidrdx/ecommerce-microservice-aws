// @flow
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $ProductId: ID!
    $Name: String!
    $Description: String
    $Price: Float!
    $Category: String!
    $Stock: Int!
  ) {
    createProduct(
      ProductId: $ProductId
      Name: $Name
      Description: $Description
      Price: $Price
      Category: $Category
      Stock: $Stock
    ) {
      ... on CreateProductSuccess {
        message
        ProductId
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $ProductId: ID!
    $Name: String
    $Description: String
    $Price: Float
    $Category: String
    $Stock: Int
  ) {
    updateProduct(
      ProductId: $ProductId
      Name: $Name
      Description: $Description
      Price: $Price
      Category: $Category
      Stock: $Stock
    ) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct($ProductId: ID!) {
    deleteProduct(ProductId: $ProductId) {
      ... on DeleteResponse {
        message
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const createTaxonomy = /* GraphQL */ `
  mutation CreateTaxonomy(
    $TaxonomyId: ID!
    $Name: String!
    $Description: String
    $ParentId: ID
    $Type: String!
  ) {
    createTaxonomy(
      TaxonomyId: $TaxonomyId
      Name: $Name
      Description: $Description
      ParentId: $ParentId
      Type: $Type
    ) {
      ... on CreateTaxonomySuccess {
        message
        TaxonomyId
      }
      ... on APIError {
        error
      }
    }
  }
`;
export const updateTaxonomy = /* GraphQL */ `
  mutation UpdateTaxonomy(
    $TaxonomyId: ID!
    $Name: String
    $Description: String
    $ParentId: ID
    $Type: String
  ) {
    updateTaxonomy(
      TaxonomyId: $TaxonomyId
      Name: $Name
      Description: $Description
      ParentId: $ParentId
      Type: $Type
    ) {
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
export const deleteTaxonomy = /* GraphQL */ `
  mutation DeleteTaxonomy($TaxonomyId: ID!) {
    deleteTaxonomy(TaxonomyId: $TaxonomyId) {
      ... on DeleteResponse {
        message
      }
      ... on APIError {
        error
      }
    }
  }
`;
