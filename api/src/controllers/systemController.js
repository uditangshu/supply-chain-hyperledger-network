const config = require('../config');

class SystemController {
    constructor(fabricService) {
        this.fabricService = fabricService;
    }

    // Health check endpoint
    healthCheck = (req, res) => {
        res.json({
            status: 'OK',
            service: config.api.title,
            version: config.api.version,
            networkInitialized: this.fabricService.isNetworkReady(),
            timestamp: new Date().toISOString()
        });
    };

    // API Documentation endpoint
    getApiDocumentation = (req, res) => {
        res.json({
            service: config.api.title,
            version: config.api.version,
            description: config.api.description,
            endpoints: {
                'GET /health': 'Health check',
                'POST /api/products/init': 'Initialize ledger with sample data',
                'GET /api/products': 'Get all products',
                'GET /api/products/:id': 'Get product by ID',
                'GET /api/products/:id/history': 'Get product history',
                'POST /api/products': 'Create new product (Bank only)',
                'PUT /api/products/:id/approve-financing': 'Approve financing (Bank only)',
                'PUT /api/products/:id/confirm-supply': 'Confirm supply (Supplier only)',
                'PUT /api/products/:id/request-manufacturing': 'Request manufacturing (Supplier only)',
                'PUT /api/products/:id/accept-manufacturing': 'Accept manufacturing (Manufacturer only)',
                'PUT /api/products/:id/complete-manufacturing': 'Complete manufacturing (Manufacturer only)'
            },
            organizations: ['Bank', 'Supplier', 'Manufacturer']
        });
    };
}

module.exports = SystemController; 