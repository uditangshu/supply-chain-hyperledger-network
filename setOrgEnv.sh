#!/usr/bin/env bash
#
# SPDX-License-Identifier: Apache-2.0

# default to using Bank
ORG=${1:-Bank}

# Exit on first error, print all commands.
set -e
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

ORDERER_CA=${DIR}/supply-chain-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
PEER0_BANK_CA=${DIR}/supply-chain-network/organizations/peerOrganizations/bank.example.com/tlsca/tlsca.bank.example.com-cert.pem
PEER0_SUPPLIER_CA=${DIR}/supply-chain-network/organizations/peerOrganizations/supplier.example.com/tlsca/tlsca.supplier.example.com-cert.pem
PEER0_MANUFACTURER_CA=${DIR}/supply-chain-network/organizations/peerOrganizations/manufacturer.example.com/tlsca/tlsca.manufacturer.example.com-cert.pem

if [[ ${ORG,,} == "bank" || ${ORG,,} == "org1" ]]; then

   CORE_PEER_LOCALMSPID=BankMSP
   CORE_PEER_MSPCONFIGPATH=${DIR}/supply-chain-network/organizations/peerOrganizations/bank.example.com/users/Admin@bank.example.com/msp
   CORE_PEER_ADDRESS=localhost:7051
   CORE_PEER_TLS_ROOTCERT_FILE=${DIR}/supply-chain-network/organizations/peerOrganizations/bank.example.com/tlsca/tlsca.bank.example.com-cert.pem

elif [[ ${ORG,,} == "supplier" || ${ORG,,} == "org2" ]]; then

   CORE_PEER_LOCALMSPID=SupplierMSP
   CORE_PEER_MSPCONFIGPATH=${DIR}/supply-chain-network/organizations/peerOrganizations/supplier.example.com/users/Admin@supplier.example.com/msp
   CORE_PEER_ADDRESS=localhost:9051
   CORE_PEER_TLS_ROOTCERT_FILE=${DIR}/supply-chain-network/organizations/peerOrganizations/supplier.example.com/tlsca/tlsca.supplier.example.com-cert.pem

elif [[ ${ORG,,} == "manufacturer" || ${ORG,,} == "org3" ]]; then

   CORE_PEER_LOCALMSPID=ManufacturerMSP
   CORE_PEER_MSPCONFIGPATH=${DIR}/supply-chain-network/organizations/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp
   CORE_PEER_ADDRESS=localhost:11051
   CORE_PEER_TLS_ROOTCERT_FILE=${DIR}/supply-chain-network/organizations/peerOrganizations/manufacturer.example.com/tlsca/tlsca.manufacturer.example.com-cert.pem

else
   echo "Unknown \"$ORG\", please choose Bank/Org1, Supplier/Org2, or Manufacturer/Org3"
   echo "For example to get the environment variables to set up a Supplier shell environment run:  ./setOrgEnv.sh Supplier"
   echo
   echo "This can be automated to set them as well with:"
   echo
   echo 'export $(./setOrgEnv.sh Supplier | xargs)'
   exit 1
fi

# output the variables that need to be set
echo "CORE_PEER_TLS_ENABLED=true"
echo "ORDERER_CA=${ORDERER_CA}"
echo "PEER0_BANK_CA=${PEER0_BANK_CA}"
echo "PEER0_SUPPLIER_CA=${PEER0_SUPPLIER_CA}"
echo "PEER0_MANUFACTURER_CA=${PEER0_MANUFACTURER_CA}"

echo "CORE_PEER_MSPCONFIGPATH=${CORE_PEER_MSPCONFIGPATH}"
echo "CORE_PEER_ADDRESS=${CORE_PEER_ADDRESS}"
echo "CORE_PEER_TLS_ROOTCERT_FILE=${CORE_PEER_TLS_ROOTCERT_FILE}"

echo "CORE_PEER_LOCALMSPID=${CORE_PEER_LOCALMSPID}"
