# Supply Chain API Gateway Documentation

## Overview
REST API Gateway for Supply Chain Hyperledger Fabric Network providing endpoints to interact with the blockchain network through three organizations: Bank, Supplier, and Manufacturer.

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. In production, implement proper authentication and authorization.

## Response Format
All API responses follow this standard format:

### Success Response
```json
{
    "success": true,
    "message": "Success message",
    "data": { /* response data */ },
    "timestamp": "2024-06-08T09:00:00.000Z"
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error message",
    "error": "Detailed error information",
    "timestamp": "2024-06-08T09:00:00.000Z"
}
```

## Endpoints

### System Endpoints

#### Health Check
- **GET** `/health`
- **Description**: Check API and network status
- **Response**: System status information

#### API Documentation
- **GET** `/`
- **Description**: Get API documentation and available endpoints
- **Response**: API information and endpoint list

### Product Endpoints

#### Initialize Ledger
- **POST** `/api/products/init`
- **Description**: Initialize the ledger with sample data
- **Organization**: Bank
- **Response**: Confirmation message

#### Get All Products
- **GET** `/api/products`
- **Description**: Retrieve all products from the ledger
- **Response**: Array of products

#### Get Product by ID
- **GET** `/api/products/:id`
- **Description**: Retrieve a specific product by ID
- **Parameters**: 
  - `id` (path): Product ID
- **Response**: Product details

#### Get Product History
- **GET** `/api/products/:id/history`
- **Description**: Get the transaction history of a product
- **Parameters**: 
  - `id` (path): Product ID
- **Response**: Array of historical transactions

#### Create Product
- **POST** `/api/products`
- **Description**: Create a new product (Bank only)
- **Request Body**:
```json
{
    "id": "product001",
    "category": "electronics",
    "name": "Smartphone",
    "status": "pending",
    "owner": "Bank",
    "value": "500",
    "description": "Latest smartphone model"
}
```
- **Required Fields**: `id`, `category`, `name`, `owner`
- **Response**: Created product details

#### Approve Financing
- **PUT** `/api/products/:id/approve-financing`
- **Description**: Approve financing for a product (Bank only)
- **Parameters**: 
  - `id` (path): Product ID
- **Request Body**:
```json
{
    "approver": "Bank Manager"
}
```
- **Response**: Updated product status

#### Confirm Supply
- **PUT** `/api/products/:id/confirm-supply`
- **Description**: Confirm supply availability (Supplier only)
- **Parameters**: 
  - `id` (path): Product ID
- **Request Body**:
```json
{
    "supplier": "Supplier Company"
}
```
- **Response**: Updated product status

#### Request Manufacturing
- **PUT** `/api/products/:id/request-manufacturing`
- **Description**: Request manufacturing (Supplier only)
- **Parameters**: 
  - `id` (path): Product ID
- **Request Body**:
```json
{
    "requester": "Supplier Company"
}
```
- **Response**: Updated product status

#### Accept Manufacturing
- **PUT** `/api/products/:id/accept-manufacturing`
- **Description**: Accept manufacturing request (Manufacturer only)
- **Parameters**: 
  - `id` (path): Product ID
- **Request Body**:
```json
{
    "manufacturer": "Manufacturing Corp"
}
```
- **Response**: Updated product status

#### Complete Manufacturing
- **PUT** `/api/products/:id/complete-manufacturing`
- **Description**: Mark manufacturing as completed (Manufacturer only)
- **Parameters**: 
  - `id` (path): Product ID
- **Request Body**:
```json
{
    "manufacturer": "Manufacturing Corp"
}
```
- **Response**: Updated product status

## Product Lifecycle Flow

1. **Create Product** (Bank) → `pending`
2. **Approve Financing** (Bank) → `financing_approved`
3. **Confirm Supply** (Supplier) → `supply_confirmed`
4. **Request Manufacturing** (Supplier) → `manufacturing_requested`
5. **Accept Manufacturing** (Manufacturer) → `manufacturing_accepted`
6. **Complete Manufacturing** (Manufacturer) → `manufacturing_completed`

## Error Codes

- **400**: Bad Request - Invalid input data
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server or blockchain error
- **503**: Service Unavailable - Network not initialized

## Example Usage

### Create a Product
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "product001",
    "category": "electronics",
    "name": "Smartphone",
    "owner": "Bank",
    "value": "500",
    "description": "Latest smartphone model"
  }'
```

### Get All Products
```bash
curl http://localhost:8000/api/products
```

### Approve Financing
```bash
curl -X PUT http://localhost:8000/api/products/product001/approve-financing \
  -H "Content-Type: application/json" \
  -d '{"approver": "Bank Manager"}'
``` 