import { ModelInit, MutableModel } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";



type EagerAPIError = {
  readonly error: string;
}

type LazyAPIError = {
  readonly error: string;
}

export declare type APIError = LazyLoading extends LazyLoadingDisabled ? EagerAPIError : LazyAPIError

export declare const APIError: (new (init: ModelInit<APIError>) => APIError)

type EagerCreateProductSuccess = {
  readonly ProductId: string;
  readonly message: string;
}

type LazyCreateProductSuccess = {
  readonly ProductId: string;
  readonly message: string;
}

export declare type CreateProductSuccess = LazyLoading extends LazyLoadingDisabled ? EagerCreateProductSuccess : LazyCreateProductSuccess

export declare const CreateProductSuccess: (new (init: ModelInit<CreateProductSuccess>) => CreateProductSuccess)

type EagerCreateTaxonomySuccess = {
  readonly TaxonomyId: string;
  readonly message: string;
}

type LazyCreateTaxonomySuccess = {
  readonly TaxonomyId: string;
  readonly message: string;
}

export declare type CreateTaxonomySuccess = LazyLoading extends LazyLoadingDisabled ? EagerCreateTaxonomySuccess : LazyCreateTaxonomySuccess

export declare const CreateTaxonomySuccess: (new (init: ModelInit<CreateTaxonomySuccess>) => CreateTaxonomySuccess)

type EagerDeleteResponse = {
  readonly message: string;
}

type LazyDeleteResponse = {
  readonly message: string;
}

export declare type DeleteResponse = LazyLoading extends LazyLoadingDisabled ? EagerDeleteResponse : LazyDeleteResponse

export declare const DeleteResponse: (new (init: ModelInit<DeleteResponse>) => DeleteResponse)

type EagerProduct = {
  readonly Category: string;
  readonly CreatedAt: string;
  readonly Description?: string | null;
  readonly Name: string;
  readonly Price: number;
  readonly ProductId: string;
  readonly Stock: number;
  readonly UpdatedAt: string;
}

type LazyProduct = {
  readonly Category: string;
  readonly CreatedAt: string;
  readonly Description?: string | null;
  readonly Name: string;
  readonly Price: number;
  readonly ProductId: string;
  readonly Stock: number;
  readonly UpdatedAt: string;
}

export declare type Product = LazyLoading extends LazyLoadingDisabled ? EagerProduct : LazyProduct

export declare const Product: (new (init: ModelInit<Product>) => Product)

type EagerProductsList = {
  readonly lastKey?: string | null;
  readonly products: (Product | null)[];
}

type LazyProductsList = {
  readonly lastKey?: string | null;
  readonly products: (Product | null)[];
}

export declare type ProductsList = LazyLoading extends LazyLoadingDisabled ? EagerProductsList : LazyProductsList

export declare const ProductsList: (new (init: ModelInit<ProductsList>) => ProductsList)

type EagerTaxonomy = {
  readonly Description?: string | null;
  readonly Name: string;
  readonly ParentId?: string | null;
  readonly TaxonomyId: string;
  readonly Type: string;
}

type LazyTaxonomy = {
  readonly Description?: string | null;
  readonly Name: string;
  readonly ParentId?: string | null;
  readonly TaxonomyId: string;
  readonly Type: string;
}

export declare type Taxonomy = LazyLoading extends LazyLoadingDisabled ? EagerTaxonomy : LazyTaxonomy

export declare const Taxonomy: (new (init: ModelInit<Taxonomy>) => Taxonomy)

type EagerTaxonomyList = {
  readonly taxonomies: (Taxonomy | null)[];
}

type LazyTaxonomyList = {
  readonly taxonomies: (Taxonomy | null)[];
}

export declare type TaxonomyList = LazyLoading extends LazyLoadingDisabled ? EagerTaxonomyList : LazyTaxonomyList

export declare const TaxonomyList: (new (init: ModelInit<TaxonomyList>) => TaxonomyList)

