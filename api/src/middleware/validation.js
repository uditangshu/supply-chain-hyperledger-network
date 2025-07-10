const { sendError } = require('../utils/response');

/**
 * Middleware to check if the Fabric network is initialized
 */
const checkNetworkInitialized = (fabricService) => (req, res, next) => {
    if (!fabricService.isNetworkReady()) {
        return sendError(res, 'Network not initialized', 'Fabric network is not ready', 503);
    }
    next();
};

/**
 * Middleware to validate product creation request
 */
const validateProductCreation = (req, res, next) => {
    const { id, name, type, quantity, price, supplierMSP } = req.body;
    
    if (!id || !name || !type || !quantity || !price || !supplierMSP) {
        return sendError(res, 'Missing required fields', 'Please provide id, name, type, quantity, price, and supplierMSP', 400);
    }
    
    next();
};

/**
 * Middleware to validate single field requirement
 */
const validateRequiredField = (fieldName) => (req, res, next) => {
    const value = req.body[fieldName];
    
    if (!value) {
        return sendError(res, `Missing ${fieldName} field`, `Please provide ${fieldName}`, 400);
    }
    
    next();
};

/**
 * Middleware to validate product ID parameter
 */
const validateProductId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id) {
        return sendError(res, 'Missing product ID', 'Product ID is required', 400);
    }
    
    next();
};

module.exports = {
    checkNetworkInitialized,
    validateProductCreation,
    validateRequiredField,
    validateProductId
}; 