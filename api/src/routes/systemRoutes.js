const express = require('express');

const createSystemRoutes = (systemController) => {
    const router = express.Router();

    // Health check endpoint
    router.get('/health', systemController.healthCheck);

    // API Documentation endpoint
    router.get('/', systemController.getApiDocumentation);

    return router;
};

module.exports = createSystemRoutes; 