#!/bin/bash

# Modify with your params
# ----------
URL_SGX_WALLET=<skale-sgx-server:1026>
CERT=$HOME/sgx.crt
CERT_KEY=$HOME/sgx.key
KEY_NAME="NEK:<your-key>"
# ----------

MESSAGE_HASH="$(node hash.js | grep "Result hash which need to be signed by SGX" -A 1 | grep 0x | xargs)"

echo "Message hash: $MESSAGE_HASH"

SGX_SIGNATURE=$(curl -s --cert $CERT --key $CERT_KEY -X POST --data "{ \"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"ecdsaSignMessageHash\", \"params\": { \"keyName\": \"$KEY_NAME\", \"base\": 16, \"messageHash\": \"$MESSAGE_HASH\" } }" -H 'content-type:application/json;' $URL_SGX_WALLET -k | jq '')

echo "SGX_SIGNATURE Results: $SGX_SIGNATURE"

R="R=$(echo $SGX_SIGNATURE | jq '.result.signature_r')"
S="S=$(echo $SGX_SIGNATURE | jq '.result.signature_s')"
V="V=$(echo $SGX_SIGNATURE | jq '.result.signature_v')"

echo $R
echo $S
echo $V

echo -e "\nPreparing the .env file...."
sed -i  "s/^R=.*/$R/g" .env
sed -i  "s/^S=.*/$S/g" .env
sed -i  "s/^V=.*/$V/g" .env


echo -e "\n\nRunning the send.js....\n"
node send.js