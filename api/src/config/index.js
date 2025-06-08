const path = require('path');
require('dotenv').config();

module.exports = {
    server: {
        port: process.env.PORT || 8000,
        env: process.env.NODE_ENV || 'development'
    },
    
    fabric: {
        connectionProfiles: {
            bank: path.join(__dirname, 'connection-bank.json'),
            supplier: path.join(__dirname, 'connection-supplier.json'),
            manufacturer: path.join(__dirname, 'connection-manufacturer.json')
        },
        walletPath: path.join(__dirname, '../../wallet'),
        channelName: 'supplychainchannel',
        chaincodeName: 'supply-chain'
    },
    
    api: {
        version: '1.0.0',
        title: 'Supply Chain API Gateway',
        description: 'REST API for Supply Chain Hyperledger Fabric Network'
    }
}; 