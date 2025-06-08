const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000';

class SupplyChainAPITester {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async testAPI() {
        console.log('🧪 Testing Supply Chain API Gateway');
        console.log('===================================');

        try {
            // Test health check
            console.log('\n1. Testing Health Check...');
            const health = await axios.get(`${this.baseURL}/health`);
            console.log('✅ Health Check:', health.data.status);

            // Test API documentation
            console.log('\n2. Getting API Documentation...');
            const docs = await axios.get(`${this.baseURL}/`);
            console.log('✅ API Documentation loaded');

            // Initialize ledger
            console.log('\n3. Initializing Ledger...');
            const init = await axios.post(`${this.baseURL}/api/products/init`);
            console.log('✅ Ledger initialized:', init.data.success);

            // Get all products
            console.log('\n4. Getting All Products...');
            const products = await axios.get(`${this.baseURL}/api/products`);
            console.log('✅ Products retrieved:', products.data.data.length, 'products');

            // Create a new product
            console.log('\n5. Creating New Product...');
            const newProduct = {
                id: 'PROD999',
                category: 'Electronics',
                name: 'Test Smartphone',
                status: 'pending',
                owner: 'Test Bank Corp',
                value: '500000',
                description: 'Test product for API demonstration'
            };
            const created = await axios.post(`${this.baseURL}/api/products`, newProduct);
            console.log('✅ Product created:', created.data.success);

            // Get specific product
            console.log('\n6. Getting Specific Product...');
            const product = await axios.get(`${this.baseURL}/api/products/PROD999`);
            console.log('✅ Product retrieved:', product.data.data.name);

            // Approve financing
            console.log('\n7. Approving Financing...');
            const approved = await axios.put(`${this.baseURL}/api/products/PROD999/approve-financing`, {
                approver: 'Test Bank Corp'
            });
            console.log('✅ Financing approved:', approved.data.success);

            // Confirm supply
            console.log('\n8. Confirming Supply...');
            const supply = await axios.put(`${this.baseURL}/api/products/PROD999/confirm-supply`, {
                supplier: 'Test Supplier Inc'
            });
            console.log('✅ Supply confirmed:', supply.data.success);

            // Request manufacturing
            console.log('\n9. Requesting Manufacturing...');
            const manufacturing = await axios.put(`${this.baseURL}/api/products/PROD999/request-manufacturing`, {
                requester: 'Test Supplier Inc'
            });
            console.log('✅ Manufacturing requested:', manufacturing.data.success);

            // Accept manufacturing
            console.log('\n10. Accepting Manufacturing...');
            const accept = await axios.put(`${this.baseURL}/api/products/PROD999/accept-manufacturing`, {
                manufacturer: 'Test Manufacturer Ltd'
            });
            console.log('✅ Manufacturing accepted:', accept.data.success);

            // Complete manufacturing
            console.log('\n11. Completing Manufacturing...');
            const complete = await axios.put(`${this.baseURL}/api/products/PROD999/complete-manufacturing`, {
                manufacturer: 'Test Manufacturer Ltd'
            });
            console.log('✅ Manufacturing completed:', complete.data.success);

            // Get product history
            console.log('\n12. Getting Product History...');
            const history = await axios.get(`${this.baseURL}/api/products/PROD999/history`);
            console.log('✅ Product history retrieved:', history.data.data.length, 'records');

            console.log('\n🎉 All API tests completed successfully!');

        } catch (error) {
            console.error('❌ API Test failed:', error.response?.data || error.message);
        }
    }
}

// Add axios to dependencies if running directly
if (require.main === module) {
    const tester = new SupplyChainAPITester();
    tester.testAPI();
}

module.exports = SupplyChainAPITester; 