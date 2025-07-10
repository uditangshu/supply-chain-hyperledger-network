const { sendError } = require('../utils/response');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    sendError(res, err, 'Internal Server Error', 500);
};

/**
 * 404 not found handler
 */
const notFoundHandler = (req, res) => {
    sendError(res, 'Route not found', 'The requested endpoint does not exist', 404);
};

module.exports = {
    errorHandler,
    notFoundHandler
}; 