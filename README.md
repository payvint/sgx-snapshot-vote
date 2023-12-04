# sgx-snapshot-vote
Instructions how to vote on SKALE snapshot space with SGX

# Initialization

node version `16.20.2`
yarn version `1.22.10`

## Install

`yarn install`

## Setup env

1. Input your validator address
2. Input which space do you want to vote(demo or main)
3. Input proposal id - you will find a hex encoded bytes32 string in the link to proposal
For example link to proposal: `https://snapshot.org/#/skale.eth/proposal/0xebbc76cf6bd1afd7e1271f4339c7c04703dbe8dda78b1a731ffaf126772c0051`
Where proposal id is `0xebbc76cf6bd1afd7e1271f4339c7c04703dbe8dda78b1a731ffaf126772c0051`
4. Select you vote from 1, 2 or 3

EXAMPLE
```
VALIDATOR_ADDRESS=0x93B603501aaE5145C97314CF1ABce76a3efd65fB
SPACE=main
PROPOSAL_ID=0xebbc76cf6bd1afd7e1271f4339c7c04703dbe8dda78b1a731ffaf126772c0051
VOTE=1
```

Create `.env` file and input these parameters

# Sign and Send
## Fast usage

Modify these params in `sign-sgx-vote.sh` with your data:

```
URL_SGX_WALLET=<skale-sgx-server:1026>
CERT=$HOME/sgx.crt
CERT_KEY=$HOME/sgx.key
KEY_NAME="NEK:<your-key>"
```

Run `bash sign-sgx-vote.sh`

Special thanks for major contribution with supporting [@easy2stake](https://github.com/easy2stake)

## Step by step usage
### Typed data hash

After you input your parameters execute the next command
`node hash.js`

If everything is good the following logs would be shown:
```
Result hash which need to be signed by SGX:
YOUR_HASH
```

### Sign by SGX

Copy the result hash from the previous step and sign by the SGX

Execute this command on the SGX:
```
export URL_SGX_WALLET="https://127.0.0.1:1026"
curl --cert <PATH_TO_CERTS>/file.crt --key <PATH_TO_CERTS>/file.key -X POST --data '{ "jsonrpc": "2.0", "id": 1, "method": "ecdsaSignMessageHash", "params": { "keyName": "KEY_NAME", "base": 16, "messageHash": "YOUR_HASH" } }' -H 'content-type:application/json;' $URL_SGX_WALLET -k
```

If everything is good the following logs would be shown:

```
{
  "id": 1,
  "jsonrpc": "2.0",
  "result": {
    "errorMessage": "",
    "signature_r": "R_VALUE",
    "signature_s": "S_VALUE",
    "signature_v": "V_VALUE",
    "status": 0
  }
}
```

### Add signature and send

#### Add signature to env

Add your r, s, and v value to the `.env` file like this:

EXAMPLE
```
VALIDATOR_ADDRESS=0x93B603501aaE5145C97314CF1ABce76a3efd65fB
SPACE=main
PROPOSAL_ID=0xebbc76cf6bd1afd7e1271f4339c7c04703dbe8dda78b1a731ffaf126772c0051
VOTE=1

R=R_VALUE
S=S_VALUE
V=V_VALUE
```

#### Send to snapshot

Execute the following command:
`node send.js`

If everything is good you will see:
```
Successful!!! Check the vote on Snapshot!
```

So please go and check your vote on Snapshot
