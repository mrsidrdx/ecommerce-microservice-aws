# E-commerce Microservice AWS Project

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Lambda Functions](#lambda-functions)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project is an e-commerce microservice built using AWS Lambda functions. It provides a set of serverless functions to manage products and taxonomies for an e-commerce platform.

## Project Structure

```
ECOMMERCE-MICROSERVICE-AWS/
├── functions/
│   ├── createProduct/
│   │   └── index.js
│   ├── createTaxonomy/
│   │   └── index.js
│   ├── deleteProduct/
│   ├── deleteTaxonomy/
│   ├── getProduct/
│   ├── getProducts/
│   ├── getTaxonomiesByParent/
│   ├── getTaxonomy/
│   ├── updateProduct/
│   └── updateTaxonomy/
├── tests/
│   ├── createProduct.test.js
│   ├── createTaxonomy.test.js
│   ├── deleteProduct.test.js
│   ├── deleteTaxonomy.test.js
│   ├── getProduct.test.js
│   ├── getProducts.test.js
│   ├── getTaxonomiesByParent.test.js
│   ├── getTaxonomy.test.js
│   ├── updateProduct.test.js
│   └── updateTaxonomy.test.js
├── node_modules/
├── .env.example
├── .gitignore
├── buildspec.yml
├── package-lock.json
├── package.json
└── README.md
```

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/mrsidrdx/ecommerce-microservice-aws.git
   cd ecommerce-microservice-aws
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the `.env.example` file to `.env` and fill in the necessary environment variables:
   ```
   cp .env.example .env
   ```

4. Install global dependencies:
   ```
   npm install -g jest
   ```

## Lambda Functions

This project includes the following Lambda functions:

- `createProduct`: Creates a new product
- `createTaxonomy`: Creates a new taxonomy
- `deleteProduct`: Deletes an existing product
- `deleteTaxonomy`: Deletes an existing taxonomy
- `getProduct`: Retrieves a single product
- `getProducts`: Retrieves multiple products
- `getTaxonomiesByParent`: Retrieves taxonomies by parent
- `getTaxonomy`: Retrieves a single taxonomy
- `updateProduct`: Updates an existing product
- `updateTaxonomy`: Updates an existing taxonomy

Each function is located in its own directory under the `functions/` folder.

## Testing

Tests for each Lambda function are located in the `tests/` directory. To run all tests:

```
npm test
```

## CI/CD Pipeline

This project uses AWS CodePipeline and CodeBuild for continuous integration and deployment. The `buildspec.yml` file defines the build and deployment process.

### Build Process

1. Install dependencies
2. Run tests for each Lambda function
3. If tests pass, zip the function code
4. Upload zipped functions to S3
5. Update Lambda functions with new code

## Environment Variables

The following environment variables are used in this project:

- `S3_BUCKET_NAME`: The name of the S3 bucket for storing Lambda function code

Ensure these are set in your AWS environment and in the `.env` file for local development.

## Deployment

Deployment is handled automatically by the CI/CD pipeline. When changes are pushed to the main branch, the pipeline will:

1. Run all tests
2. Build and package the Lambda functions
3. Deploy updated functions to AWS Lambda

For manual deployment, you can use the AWS CLI:

```
aws lambda update-function-code --function-name FUNCTION_NAME --zip-file fileb://path/to/function.zip
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request