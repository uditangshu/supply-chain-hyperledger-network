#!/bin/bash

# Supply Chain Network Demo Script
echo "🏭 Supply Chain Network Demo 🏭"
echo "================================="

# Set up environment
export PATH=$PATH:$PWD/../fabric-samples/bin
export FABRIC_CFG_PATH=$PWD/../fabric-samples/config

echo "📋 Step 1: Initialize the ledger with sample data..."
export $(./setOrgEnv.sh Bank | xargs)
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"InitLedger","Args":[]}'

echo -e "\n📦 Step 2: Query all products..."
peer chaincode query -C mychannel -n supply-chain -c '{"function":"GetAllProducts","Args":[]}'

echo -e "\n🏦 Step 3: Bank creates a financing request..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"CreateProduct","Args":["PROD004","Electronics","Smartphone Manufacturing","pending","Bank Corp","1000000","Financing request for smartphone production"]}'

echo -e "\n🏦 Step 4: Bank approves the financing..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"ApproveFinancing","Args":["PROD004","Bank Corp"]}'

echo -e "\n🏭 Step 5: Supplier confirms supply availability..."
export $(./setOrgEnv.sh Supplier | xargs)
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"ConfirmSupply","Args":["PROD004","Supplier Inc"]}'

echo -e "\n🏭 Step 6: Supplier requests manufacturing..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"RequestManufacturing","Args":["PROD004","Supplier Inc"]}'

echo -e "\n🏭 Step 7: Manufacturer accepts the order..."
export $(./setOrgEnv.sh Manufacturer | xargs)
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"AcceptManufacturing","Args":["PROD004","Manufacturer Ltd"]}'

echo -e "\n🏭 Step 8: Manufacturer completes production..."
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile $ORDERER_CA -C mychannel -n supply-chain --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_BANK_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_SUPPLIER_CA --peerAddresses localhost:11051 --tlsRootCertFiles $PEER0_MANUFACTURER_CA -c '{"function":"CompleteManufacturing","Args":["PROD004","Manufacturer Ltd"]}'

echo -e "\n📋 Step 9: Query final product status..."
peer chaincode query -C mychannel -n supply-chain -c '{"function":"ReadProduct","Args":["PROD004"]}'

echo -e "\n📜 Step 10: Query product history..."
peer chaincode query -C mychannel -n supply-chain -c '{"function":"GetProductHistory","Args":["PROD004"]}'

echo -e "\n✅ Supply Chain Demo Complete!"
echo "The product has gone through the complete supply chain process:"
echo "Bank → Supplier → Manufacturer → Completed" 