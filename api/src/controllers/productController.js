const { sendResponse, sendError, asyncHandler } = require('../utils/response');

class ProductController {
    constructor(fabricService) {
        this.fabricService = fabricService;
    }

    // Initialize Ledger
    initializeLedger = asyncHandler(async (req, res) => {
        const result = await this.fabricService.initializeLedger();
        sendResponse(res, result, 'Ledger initialized successfully');
    });

    // Get All Products
    getAllProducts = asyncHandler(async (req, res) => {
        const result = await this.fabricService.getAllProducts();
        sendResponse(res, result, 'Products retrieved successfully');
    });

    // Get Product by ID
    getProductById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await this.fabricService.getProductById(id);
        sendResponse(res, result, 'Product retrieved successfully');
    });

    // Get Product History
    getProductHistory = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await this.fabricService.getProductHistory(id);
        sendResponse(res, result, 'Product history retrieved successfully');
    });

    // Create Product (Bank only)
    createProduct = asyncHandler(async (req, res) => {
        const productData = req.body;
        const result = await this.fabricService.createProduct(productData);
        sendResponse(res, result, 'Product created successfully', 201);
    });

    // Approve Financing (Bank only)
    approveFinancing = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { financingAmount } = req.body;
        const result = await this.fabricService.approveFinancing(id, financingAmount);
        sendResponse(res, result, 'Financing approved successfully');
    });

    // Confirm Supply (Supplier only)
    confirmSupply = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await this.fabricService.confirmSupply(id);
        sendResponse(res, result, 'Supply confirmed successfully');
    });

    // Request Manufacturing (Supplier only)
    requestManufacturing = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { manufacturerMSP } = req.body;
        const result = await this.fabricService.requestManufacturing(id, manufacturerMSP);
        sendResponse(res, result, 'Manufacturing requested successfully');
    });

    // Accept Manufacturing (Manufacturer only)  
    acceptManufacturing = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await this.fabricService.acceptManufacturing(id);
        sendResponse(res, result, 'Manufacturing accepted successfully');
    });

    // Complete Manufacturing (Manufacturer only)
    completeManufacturing = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await this.fabricService.completeManufacturing(id);
        sendResponse(res, result, 'Manufacturing completed successfully');
    });
}

module.exports = ProductController; 