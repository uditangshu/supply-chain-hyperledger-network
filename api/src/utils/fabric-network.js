const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');
const config = require('../config');

class FabricNetwork {
    constructor() {
        this.channelName = config.fabric.channelName;
        this.chaincodeName = config.fabric.chaincodeName;
        this.walletPath = config.fabric.walletPath;
    }

    async getConnectionProfile(organization) {
        const orgKey = organization.toLowerCase();
        const ccpPath = config.fabric.connectionProfiles[orgKey];
        
        if (!ccpPath || !fs.existsSync(ccpPath)) {
            throw new Error(`Connection profile not found for organization: ${organization}`);
        }
        return JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    }

    async createWallet() {
        const wallet = await Wallets.newFileSystemWallet(this.walletPath);
        return wallet;
    }

    async enrollAdmin(organization) {
        try {
            const ccp = await this.getConnectionProfile(organization);
            const wallet = await this.createWallet();

            // Check if admin already exists
            const identity = await wallet.get(`admin-${organization.toLowerCase()}`);
            if (identity) {
                console.log(`Admin identity already exists for ${organization}`);
                return;
            }

            // Get CA info for the organization
            const caName = `ca.${organization.toLowerCase()}.example.com`;
            const caURL = ccp.certificateAuthorities[caName].url;
            const ca = new FabricCAServices(caURL);

            // Create admin identity
            const adminIdentity = {
                credentials: {
                    certificate: this.getAdminCert(organization),
                    privateKey: this.getAdminPrivateKey(organization)
                },
                mspId: `${organization}MSP`,
                type: 'X.509',
            };

            await wallet.put(`admin-${organization.toLowerCase()}`, adminIdentity);
            console.log(`Admin identity created for ${organization}`);
        } catch (error) {
            console.error(`Failed to enroll admin for ${organization}:`, error);
            throw error;
        }
    }

    getAdminCert(organization) {
        const certPath = path.join(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 
            `${organization.toLowerCase()}.example.com`, 'users', 
            `Admin@${organization.toLowerCase()}.example.com`, 'msp', 'signcerts');
        
        const certFile = fs.readdirSync(certPath)[0];
        return fs.readFileSync(path.join(certPath, certFile), 'utf8');
    }

    getAdminPrivateKey(organization) {
        const keyPath = path.join(__dirname, '..', '..', '..', 'organizations', 'peerOrganizations', 
            `${organization.toLowerCase()}.example.com`, 'users', 
            `Admin@${organization.toLowerCase()}.example.com`, 'msp', 'keystore');
        
        const keyFile = fs.readdirSync(keyPath)[0];
        return fs.readFileSync(path.join(keyPath, keyFile), 'utf8');
    }

    async getContract(organization) {
        try {
            const ccp = await this.getConnectionProfile(organization);
            const wallet = await this.createWallet();

            // Create gateway
            const gateway = new Gateway();
            await gateway.connect(ccp, {
                wallet,
                identity: `admin-${organization.toLowerCase()}`,
                discovery: { enabled: true, asLocalhost: true }
            });

            // Get network and contract
            const network = await gateway.getNetwork(this.channelName);
            const contract = network.getContract(this.chaincodeName);

            return { gateway, contract };
        } catch (error) {
            console.error(`Failed to get contract for ${organization}:`, error);
            throw error;
        }
    }

    async submitTransaction(organization, functionName, ...args) {
        let gateway;
        try {
            const { gateway: gw, contract } = await this.getContract(organization);
            gateway = gw;

            console.log(`Submitting transaction: ${functionName} with args: ${args.join(', ')}`);
            const result = await contract.submitTransaction(functionName, ...args);
            
            await gateway.disconnect();
            return result.toString();
        } catch (error) {
            if (gateway) await gateway.disconnect();
            console.error(`Transaction failed: ${functionName}`, error);
            throw error;
        }
    }

    async evaluateTransaction(organization, functionName, ...args) {
        let gateway;
        try {
            const { gateway: gw, contract } = await this.getContract(organization);
            gateway = gw;

            console.log(`Evaluating transaction: ${functionName} with args: ${args.join(', ')}`);
            const result = await contract.evaluateTransaction(functionName, ...args);
            
            await gateway.disconnect();
            return result.toString();
        } catch (error) {
            if (gateway) await gateway.disconnect();
            console.error(`Query failed: ${functionName}`, error);
            throw error;
        }
    }

    async initializeNetwork() {
        console.log('Initializing Fabric Network...');
        const organizations = ['Bank', 'Supplier', 'Manufacturer'];
        
        for (const org of organizations) {
            await this.enrollAdmin(org);
        }
        
        console.log('Fabric Network initialized successfully');
    }
}

module.exports = FabricNetwork; 