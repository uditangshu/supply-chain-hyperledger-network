/**
 * Utility function to send successful responses
 */
const sendResponse = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data: typeof data === 'string' && (data.startsWith('[') || data.startsWith('{')) ? JSON.parse(data) : data,
        timestamp: new Date().toISOString()
    });
};

/**
 * Utility function to send error responses
 */
const sendError = (res, error, message = 'An error occurred', statusCode = 500) => {
    console.error('API Error:', error);
    res.status(statusCode).json({
        success: false,
        message,
        error: error.message || error,
        timestamp: new Date().toISOString()
    });
};

/**
 * Async handler wrapper for Express routes
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    sendResponse,
    sendError,
    asyncHandler
}; 