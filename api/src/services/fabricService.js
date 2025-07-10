const FabricNetwork = require('../utils/fabric-network');

class FabricService {
    constructor() {
        this.fabricNetwork = new FabricNetwork();
        this.isInitialized = false;
    }

    async initialize() {
        try {
            await this.fabricNetwork.initializeNetwork();
            this.isInitialized = true;
            console.log('✅ Fabric Service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Fabric Service:', error);
            throw error;
        }
    }

    isNetworkReady() {
        return this.isInitialized;
    }

    // Ledger operations
    async initializeLedger() {
        return await this.fabricNetwork.submitTransaction('Bank', 'InitLedger');
    }

    async getAllProducts() {
        return await this.fabricNetwork.evaluateTransaction('Bank', 'GetAllProducts');
    }

    async getProductById(id) {
        return await this.fabricNetwork.evaluateTransaction('Bank', 'ReadProduct', id);
    }

    async getProductHistory(id) {
        return await this.fabricNetwork.evaluateTransaction('Bank', 'GetProductHistory', id);
    }

    // Product lifecycle operations
    async createProduct(productData) {
        const { id, name, type, quantity, price, supplierMSP } = productData;
        return await this.fabricNetwork.submitTransaction(
            'Bank', 
            'CreateProduct', 
            id, 
            name, 
            type, 
            quantity.toString(), 
            price.toString(), 
            supplierMSP
        );
    }

    async approveFinancing(id, financingAmount) {
        return await this.fabricNetwork.submitTransaction('Bank', 'ApproveFinancing', id, financingAmount.toString());
    }

    async confirmSupply(id) {
        return await this.fabricNetwork.submitTransaction('Supplier', 'ConfirmSupply', id);
    }

    async requestManufacturing(id, manufacturerMSP) {
        return await this.fabricNetwork.submitTransaction('Supplier', 'RequestManufacturing', id, manufacturerMSP);
    }

    async acceptManufacturing(id) {
        return await this.fabricNetwork.submitTransaction('Manufacturer', 'AcceptManufacturing', id);
    }

    async completeManufacturing(id) {
        return await this.fabricNetwork.submitTransaction('Manufacturer', 'CompleteManufacturing', id);
    }
}

module.exports = FabricService; 