const createProductRoutes = require('./productRoutes');
const createSystemRoutes = require('./systemRoutes');

const setupRoutes = (app, productController, systemController, fabricService) => {
    // System routes (health check and documentation)
    const systemRoutes = createSystemRoutes(systemController);
    app.use('/', systemRoutes);

    // Product API routes
    const productRoutes = createProductRoutes(productController, fabricService);
    app.use('/api/products', productRoutes);
};

module.exports = setupRoutes; 