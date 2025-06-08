const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');

const config = require('./config');
const setupRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const createApp = (systemController, productController, fabricService) => {
    const app = express();

    // Security and parsing middleware
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(morgan('combined'));

    // Setup routes
    setupRoutes(app, productController, systemController, fabricService);

    // Error handling middleware (must be last)
    app.use(errorHandler);
    app.use('*', notFoundHandler);

    return app;
};

module.exports = createApp; 