/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProductMutationVariables = {|
  ProductId: string,
  Name: string,
  Description?: ?string,
  Price: number,
  Category: string,
  Stock: number,
|};

export type CreateProductMutation = {|
  createProduct:( {
      __typename: "CreateProductSuccess",
      message: string,
      ProductId: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type UpdateProductMutationVariables = {|
  ProductId: string,
  Name?: ?string,
  Description?: ?string,
  Price?: ?number,
  Category?: ?string,
  Stock?: ?number,
|};

export type UpdateProductMutation = {|
  updateProduct:( {
      __typename: "Product",
      ProductId: string,
      Name: string,
      Description: ?string,
      Price: number,
      Category: string,
      Stock: number,
      CreatedAt: any,
      UpdatedAt: any,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type DeleteProductMutationVariables = {|
  ProductId: string,
|};

export type DeleteProductMutation = {|
  deleteProduct:( {
      __typename: "DeleteResponse",
      message: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type CreateTaxonomyMutationVariables = {|
  TaxonomyId: string,
  Name: string,
  Description?: ?string,
  ParentId?: ?string,
  Type: string,
|};

export type CreateTaxonomyMutation = {|
  createTaxonomy:( {
      __typename: "CreateTaxonomySuccess",
      message: string,
      TaxonomyId: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type UpdateTaxonomyMutationVariables = {|
  TaxonomyId: string,
  Name?: ?string,
  Description?: ?string,
  ParentId?: ?string,
  Type?: ?string,
|};

export type UpdateTaxonomyMutation = {|
  updateTaxonomy:( {
      __typename: "Taxonomy",
      TaxonomyId: string,
      Name: string,
      Description: ?string,
      ParentId: ?string,
      Type: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type DeleteTaxonomyMutationVariables = {|
  TaxonomyId: string,
|};

export type DeleteTaxonomyMutation = {|
  deleteTaxonomy:( {
      __typename: "DeleteResponse",
      message: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type GetProductQueryVariables = {|
  ProductId: string,
|};

export type GetProductQuery = {|
  getProduct:( {
      __typename: "Product",
      ProductId: string,
      Name: string,
      Description: ?string,
      Price: number,
      Category: string,
      Stock: number,
      CreatedAt: any,
      UpdatedAt: any,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type GetTaxonomyQueryVariables = {|
  TaxonomyId: string,
|};

export type GetTaxonomyQuery = {|
  getTaxonomy:( {
      __typename: "Taxonomy",
      TaxonomyId: string,
      Name: string,
      Description: ?string,
      ParentId: ?string,
      Type: string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type GetTaxonomiesByParentQueryVariables = {|
  ParentId: string,
|};

export type GetTaxonomiesByParentQuery = {|
  getTaxonomiesByParent:( {
      __typename: "TaxonomyList",
      taxonomies:  Array<? {|
        __typename: string,
        TaxonomyId: string,
        Name: string,
        Description: ?string,
        ParentId: ?string,
        Type: string,
      |} >,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};

export type GetProductsQueryVariables = {|
  Name?: ?string,
  Category?: ?string,
  Price?: ?number,
  limit?: ?number,
  lastKey?: ?string,
|};

export type GetProductsQuery = {|
  getProducts:( {
      __typename: "ProductsList",
      products:  Array<? {|
        __typename: string,
        ProductId: string,
        Name: string,
        Description: ?string,
        Price: number,
        Category: string,
        Stock: number,
        CreatedAt: any,
        UpdatedAt: any,
      |} >,
      lastKey: ?string,
    } | {
      __typename: "APIError",
      error: string,
    }
  ),
|};