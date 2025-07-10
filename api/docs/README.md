# Supply Chain API Gateway

A REST API Gateway for the Supply Chain Hyperledger Fabric Network that provides HTTP endpoints to interact with the blockchain network.

## Features

- ✅ **RESTful API** - Standard HTTP endpoints for all chaincode functions
- ✅ **Multi-Organization Support** - Bank, Supplier, Manufacturer organizations
- ✅ **Automatic Wallet Management** - Handles Fabric identities and certificates
- ✅ **Error Handling** - Comprehensive error responses and logging
- ✅ **API Documentation** - Built-in endpoint documentation
- ✅ **Health Monitoring** - Health check endpoints
- ✅ **CORS Support** - Cross-origin resource sharing enabled
- ✅ **Security Headers** - Helmet.js integration for security

## Prerequisites

- Node.js 16+ and npm
- Running Hyperledger Fabric network (supply-chain-network)
- Deployed supply-chain chaincode

## Installation

1. **Navigate to API directory:**
   ```bash
   cd supply-chain-network/api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the API server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health & Documentation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API documentation |

### Products

| Method | Endpoint | Description | Organization |
|--------|----------|-------------|--------------|
| POST | `/api/products/init` | Initialize ledger | Bank |
| GET | `/api/products` | Get all products | Any |
| GET | `/api/products/:id` | Get product by ID | Any |
| GET | `/api/products/:id/history` | Get product history | Any |
| POST | `/api/products` | Create new product | Bank |

### Supply Chain Operations

| Method | Endpoint | Description | Organization |
|--------|----------|-------------|--------------|
| PUT | `/api/products/:id/approve-financing` | Approve financing | Bank |
| PUT | `/api/products/:id/confirm-supply` | Confirm supply | Supplier |
| PUT | `/api/products/:id/request-manufacturing` | Request manufacturing | Supplier |
| PUT | `/api/products/:id/accept-manufacturing` | Accept manufacturing | Manufacturer |
| PUT | `/api/products/:id/complete-manufacturing` | Complete manufacturing | Manufacturer |

## Usage Examples

### 1. Initialize Ledger
```bash
curl -X POST http://localhost:8000/api/products/init
```

### 2. Get All Products
```bash
curl http://localhost:8000/api/products
```

### 3. Create a New Product
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "id": "PROD005",
    "category": "Electronics",
    "name": "Tablet Manufacturing",
    "status": "pending",
    "owner": "Bank Corp",
    "value": "750000",
    "description": "Financing request for tablet production"
  }'
```

### 4. Approve Financing
```bash
curl -X PUT http://localhost:8000/api/products/PROD005/approve-financing \
  -H "Content-Type: application/json" \
  -d '{"approver": "Bank Corp"}'
```

### 5. Confirm Supply
```bash
curl -X PUT http://localhost:8000/api/products/PROD005/confirm-supply \
  -H "Content-Type: application/json" \
  -d '{"supplier": "Supplier Inc"}'
```

### 6. Request Manufacturing
```bash
curl -X PUT http://localhost:8000/api/products/PROD005/request-manufacturing \
  -H "Content-Type: application/json" \
  -d '{"requester": "Supplier Inc"}'
```

### 7. Accept Manufacturing
```bash
curl -X PUT http://localhost:8000/api/products/PROD005/accept-manufacturing \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": "Manufacturer Ltd"}'
```

### 8. Complete Manufacturing
```bash
curl -X PUT http://localhost:8000/api/products/PROD005/complete-manufacturing \
  -H "Content-Type: application/json" \
  -d '{"manufacturer": "Manufacturer Ltd"}'
```

### 9. Get Product History
```bash
curl http://localhost:8000/api/products/PROD005/history
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2025-06-08T08:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message",
  "timestamp": "2025-06-08T08:00:00.000Z"
}
```

## Testing

Run the comprehensive API test suite:

```bash
node test-api.js
```

This will test all endpoints and demonstrate the complete supply chain workflow.

## Project Structure

```
api/
├── server.js              # Main Express server
├── fabric-network.js      # Fabric network utilities
├── package.json           # Dependencies and scripts
├── test-api.js           # API testing script
├── connection-bank.json  # Bank connection profile
├── connection-supplier.json # Supplier connection profile
├── connection-manufacturer.json # Manufacturer connection profile
├── wallet/               # Auto-generated wallet directory
└── README.md            # This file
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8000 | Server port |
| NODE_ENV | development | Environment mode |

## Architecture

The API Gateway acts as a bridge between HTTP clients and the Hyperledger Fabric network:

```
Client Application
       ↓
   REST API (Port 8000)
       ↓
   Fabric SDK
       ↓
   Hyperledger Fabric Network
   (Bank, Supplier, Manufacturer peers)
```

## Security Considerations

- **TLS Certificates**: Uses organization-specific TLS certificates
- **Identity Management**: Automatic wallet and identity management
- **Input Validation**: Validates all request parameters
- **Error Handling**: Prevents sensitive information leakage
- **CORS**: Configurable cross-origin access
- **Security Headers**: Helmet.js protection

## Troubleshooting

### Common Issues

1. **Network not initialized**
   - Ensure the Fabric network is running
   - Check that chaincode is deployed
   - Verify connection profiles are correct

2. **Certificate errors**
   - Ensure crypto materials exist
   - Check file permissions
   - Verify organization names match

3. **Port conflicts**
   - Change PORT environment variable
   - Check if port 8000 is available

### Logs

The server provides detailed logging for debugging:
- Request/response logging via Morgan
- Fabric SDK operation logs
- Error stack traces in development mode

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

Apache 2.0 License - see LICENSE file for details 