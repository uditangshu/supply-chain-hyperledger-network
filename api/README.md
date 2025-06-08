# Supply Chain API Gateway

A professional REST API Gateway for Hyperledger Fabric Supply Chain Network with proper MVC architecture.

## 🏗️ Architecture

This API follows a clean, modular architecture with proper separation of concerns:

```
api/
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   ├── index.js             # Main configuration
│   │   ├── connection-bank.json
│   │   ├── connection-supplier.json
│   │   └── connection-manufacturer.json
│   ├── controllers/             # Route handlers
│   │   ├── productController.js
│   │   └── systemController.js
│   ├── services/                # Business logic
│   │   └── fabricService.js
│   ├── models/                  # Data models
│   │   └── Product.js
│   ├── middleware/              # Custom middleware
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── utils/                   # Utility functions
│   │   ├── response.js
│   │   └── fabric-network.js
│   ├── routes/                  # Route definitions
│   │   ├── index.js
│   │   ├── productRoutes.js
│   │   └── systemRoutes.js
│   ├── app.js                   # Express app setup
│   └── server.js                # Main server file
├── tests/                       # Test files
│   └── test-api.js
├── docs/                        # Documentation
│   └── API.md
├── scripts/                     # Utility scripts
│   └── start.sh
├── wallet/                      # Fabric identities
├── node_modules/                # Dependencies
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Running Hyperledger Fabric network
- Deployed supply chain chaincode

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start the server:**
```bash
npm start
# or use the startup script
./scripts/start.sh
```

3. **Development mode:**
```bash
npm run dev
```

## 📡 API Endpoints

### System
- `GET /health` - Health check
- `GET /` - API documentation

### Products
- `POST /api/products/init` - Initialize ledger
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/:id/history` - Get product history
- `POST /api/products` - Create product (Bank)
- `PUT /api/products/:id/approve-financing` - Approve financing (Bank)
- `PUT /api/products/:id/confirm-supply` - Confirm supply (Supplier)
- `PUT /api/products/:id/request-manufacturing` - Request manufacturing (Supplier)
- `PUT /api/products/:id/accept-manufacturing` - Accept manufacturing (Manufacturer)
- `PUT /api/products/:id/complete-manufacturing` - Complete manufacturing (Manufacturer)

## 🏢 Organizations

The API supports three organizations:
- **Bank**: Creates products and approves financing
- **Supplier**: Confirms supply and requests manufacturing
- **Manufacturer**: Accepts and completes manufacturing

## 🔧 Configuration

Configuration is centralized in `src/config/index.js`:

```javascript
module.exports = {
    server: {
        port: process.env.PORT || 8000,
        env: process.env.NODE_ENV || 'development'
    },
    fabric: {
        connectionProfiles: { /* ... */ },
        walletPath: '../../wallet',
        channelName: 'mychannel',
        chaincodeName: 'basic'
    }
};
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📚 Documentation

Detailed API documentation is available in:
- `docs/API.md` - Complete API reference
- `GET /` endpoint - Interactive API documentation

## 🛡️ Security Features

- **Helmet.js**: Security headers
- **CORS**: Cross-origin resource sharing
- **Input validation**: Request validation middleware
- **Error handling**: Centralized error management

## 🔄 Development

### Adding New Endpoints

1. **Create controller method** in `src/controllers/`
2. **Add route** in `src/routes/`
3. **Add validation** in `src/middleware/validation.js`
4. **Update documentation**

### Project Structure Benefits

- **Separation of Concerns**: Each layer has a specific responsibility
- **Maintainability**: Easy to locate and modify code
- **Testability**: Components can be tested in isolation
- **Scalability**: Easy to add new features and endpoints
- **Professional**: Follows industry best practices

## 🌐 Environment Variables

```bash
PORT=8000                    # Server port
NODE_ENV=development         # Environment mode
```

## 📦 Dependencies

### Production
- **express**: Web framework
- **fabric-network**: Hyperledger Fabric SDK
- **fabric-ca-client**: Certificate Authority client
- **cors**: Cross-origin resource sharing
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **body-parser**: Request body parsing

### Development
- **nodemon**: Development server with auto-restart

## 🚦 Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **404**: Not Found
- **500**: Internal Server Error
- **503**: Service Unavailable

## 🔍 Monitoring

- Health check endpoint: `GET /health`
- Request logging with Morgan
- Centralized error handling
- Graceful shutdown handling

## 🤝 Contributing

1. Follow the established architecture patterns
2. Add proper validation for new endpoints
3. Update documentation
4. Write tests for new features
5. Follow consistent code style

## 📄 License

Apache-2.0 License 