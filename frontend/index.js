// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { APIError, CreateProductSuccess, CreateTaxonomySuccess, DeleteResponse, Product, ProductsList, Taxonomy, TaxonomyList } = initSchema(schema);

export {
  APIError,
  CreateProductSuccess,
  CreateTaxonomySuccess,
  DeleteResponse,
  Product,
  ProductsList,
  Taxonomy,
  TaxonomyList
};