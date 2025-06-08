/**
 * Product model definition for supply chain
 */
class Product {
    constructor(data) {
        this.id = data.id;
        this.category = data.category;
        this.name = data.name;
        this.status = data.status || 'pending';
        this.owner = data.owner;
        this.value = data.value || '0';
        this.description = data.description || '';
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Validate required fields
     */
    static validate(data) {
        const errors = [];
        
        if (!data.id) errors.push('Product ID is required');
        if (!data.category) errors.push('Product category is required');
        if (!data.name) errors.push('Product name is required');
        if (!data.owner) errors.push('Product owner is required');
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Product status enum
     */
    static get STATUS() {
        return {
            PENDING: 'pending',
            FINANCING_APPROVED: 'financing_approved',
            SUPPLY_CONFIRMED: 'supply_confirmed',
            MANUFACTURING_REQUESTED: 'manufacturing_requested',
            MANUFACTURING_ACCEPTED: 'manufacturing_accepted',
            MANUFACTURING_COMPLETED: 'manufacturing_completed'
        };
    }

    /**
     * Valid product categories
     */
    static get CATEGORIES() {
        return [
            'electronics',
            'automotive',
            'textiles',
            'food',
            'pharmaceuticals',
            'machinery',
            'raw_materials',
            'other'
        ];
    }
}

module.exports = Product; 