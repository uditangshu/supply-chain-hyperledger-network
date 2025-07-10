const express = require('express');
const { 
    checkNetworkInitialized, 
    validateProductCreation, 
    validateRequiredField,
    validateProductId 
} = require('../middleware/validation');

const createProductRoutes = (productController, fabricService) => {
    const router = express.Router();
    const networkCheck = checkNetworkInitialized(fabricService);

    // Initialize Ledger
    router.post('/init', networkCheck, productController.initializeLedger);

    // Get All Products
    router.get('/', networkCheck, productController.getAllProducts);

    // Get Product by ID
    router.get('/:id', networkCheck, validateProductId, productController.getProductById);

    // Get Product History
    router.get('/:id/history', networkCheck, validateProductId, productController.getProductHistory);

    // Create Product (Bank only)
    router.post('/', networkCheck, validateProductCreation, productController.createProduct);

    // Approve Financing (Bank only)
    router.put('/:id/approve-financing', 
        networkCheck, 
        validateProductId, 
        validateRequiredField('financingAmount'), 
        productController.approveFinancing
    );

    // Confirm Supply (Supplier only)
    router.put('/:id/confirm-supply', 
        networkCheck, 
        validateProductId, 
        productController.confirmSupply
    );

    // Request Manufacturing (Supplier only)
    router.put('/:id/request-manufacturing', 
        networkCheck, 
        validateProductId, 
        validateRequiredField('manufacturerMSP'), 
        productController.requestManufacturing
    );

    // Accept Manufacturing (Manufacturer only)
    router.put('/:id/accept-manufacturing', 
        networkCheck, 
        validateProductId, 
        productController.acceptManufacturing
    );

    // Complete Manufacturing (Manufacturer only)
    router.put('/:id/complete-manufacturing', 
        networkCheck, 
        validateProductId, 
        productController.completeManufacturing
    );

    return router;
};

module.exports = createProductRoutes; 