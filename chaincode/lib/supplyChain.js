/*
 * Supply Chain Chaincode for Bank-Supplier-Manufacturer Network
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify = require('json-stringify-deterministic');
const sortKeysRecursive = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class SupplyChain extends Contract {

    async InitLedger(ctx) {
        const products = [
            {
                ID: 'product1',
                Name: 'Steel Sheets',
                Type: 'RawMaterial',
                Status: 'Requested',
                Quantity: 1000,
                Price: 50000,
                Supplier: 'SupplierMSP',
                Manufacturer: '',
                BankApproval: false,
                FinancingAmount: 0,
                CreatedAt: new Date().toISOString(),
                History: []
            },
            {
                ID: 'product2',
                Name: 'Electronic Components',
                Type: 'Component',
                Status: 'Financed',
                Quantity: 500,
                Price: 25000,
                Supplier: 'SupplierMSP',
                Manufacturer: 'ManufacturerMSP',
                BankApproval: true,
                FinancingAmount: 25000,
                CreatedAt: new Date().toISOString(),
                History: ['Bank approved financing', 'Supplier confirmed availability']
            }
        ];

        for (const product of products) {
            product.docType = 'product';
            await ctx.stub.putState(product.ID, Buffer.from(stringify(sortKeysRecursive(product))));
        }
    }

    // CreateProduct - Bank creates a new product financing request
    async CreateProduct(ctx, id, name, type, quantity, price, supplierMSP) {
        const exists = await this.ProductExists(ctx, id);
        if (exists) {
            throw new Error(`The product ${id} already exists`);
        }

        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'BankMSP') {
            throw new Error('Only the bank can create product financing requests');
        }

        const product = {
            ID: id,
            Name: name,
            Type: type,
            Status: 'Requested',
            Quantity: Number(quantity),
            Price: Number(price),
            Supplier: supplierMSP,
            Manufacturer: '',
            BankApproval: false,
            FinancingAmount: 0,
            CreatedAt: new Date().toISOString(),
            History: ['Product financing request created by bank'],
            docType: 'product'
        };

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // ApproveFinancing - Bank approves financing for a product
    async ApproveFinancing(ctx, id, financingAmount) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'BankMSP') {
            throw new Error('Only the bank can approve financing');
        }

        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);

        if (product.BankApproval) {
            throw new Error(`Financing for product ${id} already approved`);
        }

        product.BankApproval = true;
        product.FinancingAmount = Number(financingAmount);
        product.Status = 'Financed';
        product.History.push(`Bank approved financing of ${financingAmount} on ${new Date().toISOString()}`);

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // ConfirmSupply - Supplier confirms they can supply the product
    async ConfirmSupply(ctx, id) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'SupplierMSP') {
            throw new Error('Only the supplier can confirm supply');
        }

        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);

        if (!product.BankApproval) {
            throw new Error(`Product ${id} needs bank financing approval first`);
        }

        if (product.Supplier !== clientMSP) {
            throw new Error(`You are not the designated supplier for product ${id}`);
        }

        product.Status = 'SupplierConfirmed';
        product.History.push(`Supplier confirmed availability on ${new Date().toISOString()}`);

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // RequestManufacturing - Assign product to manufacturer
    async RequestManufacturing(ctx, id, manufacturerMSP) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'SupplierMSP') {
            throw new Error('Only the supplier can request manufacturing');
        }

        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);

        if (product.Status !== 'SupplierConfirmed') {
            throw new Error(`Product ${id} must be supplier confirmed before requesting manufacturing`);
        }

        product.Manufacturer = manufacturerMSP;
        product.Status = 'ManufacturingRequested';
        product.History.push(`Manufacturing requested from ${manufacturerMSP} on ${new Date().toISOString()}`);

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // AcceptManufacturing - Manufacturer accepts the manufacturing request
    async AcceptManufacturing(ctx, id) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'ManufacturerMSP') {
            throw new Error('Only the manufacturer can accept manufacturing');
        }

        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);

        if (product.Manufacturer !== clientMSP) {
            throw new Error(`You are not the designated manufacturer for product ${id}`);
        }

        if (product.Status !== 'ManufacturingRequested') {
            throw new Error(`Manufacturing for product ${id} was not requested`);
        }

        product.Status = 'InManufacturing';
        product.History.push(`Manufacturing accepted and started on ${new Date().toISOString()}`);

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // CompleteManufacturing - Manufacturer completes the manufacturing
    async CompleteManufacturing(ctx, id) {
        const clientMSP = ctx.clientIdentity.getMSPID();
        if (clientMSP !== 'ManufacturerMSP') {
            throw new Error('Only the manufacturer can complete manufacturing');
        }

        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);

        if (product.Manufacturer !== clientMSP) {
            throw new Error(`You are not the designated manufacturer for product ${id}`);
        }

        if (product.Status !== 'InManufacturing') {
            throw new Error(`Product ${id} is not currently in manufacturing`);
        }

        product.Status = 'Completed';
        product.History.push(`Manufacturing completed on ${new Date().toISOString()}`);

        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(product))));
        return JSON.stringify(product);
    }

    // ReadProduct returns the product stored in the world state with given id
    async ReadProduct(ctx, id) {
        const productJSON = await ctx.stub.getState(id);
        if (!productJSON || productJSON.length === 0) {
            throw new Error(`The product ${id} does not exist`);
        }
        return productJSON.toString();
    }

    // ProductExists returns true when product with given ID exists in world state
    async ProductExists(ctx, id) {
        const productJSON = await ctx.stub.getState(id);
        return productJSON && productJSON.length > 0;
    }

    // GetAllProducts returns all products found in the world state
    async GetAllProducts(ctx) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // GetProductsByStatus returns products with a specific status
    async GetProductsByStatus(ctx, status) {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (record.Status === status) {
                    allResults.push(record);
                }
            } catch (err) {
                console.log(err);
            }
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    // GetProductHistory returns the history of a product
    async GetProductHistory(ctx, id) {
        const productString = await this.ReadProduct(ctx, id);
        const product = JSON.parse(productString);
        return JSON.stringify(product.History);
    }
}

module.exports = SupplyChain; 