const config = require('./config');
const createApp = require('./app');

// Import services and controllers
const FabricService = require('./services/fabricService');
const ProductController = require('./controllers/productController');
const SystemController = require('./controllers/systemController');

// Initialize services
const fabricService = new FabricService();

// Initialize controllers
const productController = new ProductController(fabricService);
const systemController = new SystemController(fabricService);

// Create Express app
const app = createApp(systemController, productController, fabricService);

// Start server
const startServer = async () => {
    try {
        // Initialize Fabric network
        await fabricService.initialize();
        
        // Start HTTP server
        app.listen(config.server.port, '0.0.0.0', () => {
            console.log(`🚀 ${config.api.title} running on port ${config.server.port}`);
            console.log(`📡 Network initialized: ${fabricService.isNetworkReady()}`);
            console.log(`🌐 API Documentation: http://localhost:${config.server.port}/`);
            console.log(`🌐 Public Access: http://20.189.232.16:${config.server.port}/`);
            console.log(`❤️  Health Check: http://20.189.232.16:${config.server.port}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown handlers
const shutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}, shutting down server gracefully...`);
    process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Start the server
startServer(); 