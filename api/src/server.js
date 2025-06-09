const https = require('https');
const fs = require('fs');
const path = require('path');
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
        
        if (config.server.https.enabled) {
            // HTTPS Server configuration
            const httpsOptions = {
                key: fs.readFileSync(path.resolve(config.server.https.keyPath)),
                cert: fs.readFileSync(path.resolve(config.server.https.certPath))
            };
            
            const server = https.createServer(httpsOptions, app);
            server.listen(config.server.port, '0.0.0.0', () => {
                console.log(`🚀 ${config.api.title} running on HTTPS port ${config.server.port}`);
                console.log(`📡 Network initialized: ${fabricService.isNetworkReady()}`);
                console.log(`🌐 API Documentation: https://localhost:${config.server.port}/`);
                console.log(`🌐 Public Access: https://20.189.232.16:${config.server.port}/`);
                console.log(`❤️  Health Check: https://20.189.232.16:${config.server.port}/health`);
            });
        } else {
            // HTTP Server (fallback)
            app.listen(config.server.port, '0.0.0.0', () => {
                console.log(`🚀 ${config.api.title} running on HTTP port ${config.server.port}`);
                console.log(`📡 Network initialized: ${fabricService.isNetworkReady()}`);
                console.log(`🌐 API Documentation: http://localhost:${config.server.port}/`);
                console.log(`🌐 Public Access: http://20.189.232.16:${config.server.port}/`);
                console.log(`❤️  Health Check: http://20.189.232.16:${config.server.port}/health`);
            });
        }
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