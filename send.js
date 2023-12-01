const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const snapshot = require('@snapshot-labs/snapshot.js');

const hub = process.env.SPACE === "main" ? 'https://hub.snapshot.org' : "https://testnet.hub.snapshot.org";
const client = new snapshot.Client712(hub);

let r = "";
let s = "";
let v = "";

if (ethers.isHexString(process.env.R, 32)) {
    r = process.env.R;
    console.log("R:", r);
} else {
    console.log("R is incorrect!");
    return 0;
}

if (ethers.isHexString(process.env.S, 32)) {
    s = process.env.S;
    console.log("S:", s);
} else {
    console.log("S is incorrect!");
    return 0;
}

if (parseInt(process.env.V) === 0) {
    v = "1b";
    console.log("V:", v);
} else if (parseInt(process.env.V) === 1) {
    v = "1C";
    console.log("V:", v);
} else {
    console.log("V is incorrect, please input V in .env - 0 or 1");
    return 0;
} 

const signature = "0x" + r.slice(2) + s.slice(2) + v;

async function checkAndSend() {
    const result = JSON.parse(await fs.readFile("./data/result.json", "utf-8"));
    const verifyAddress = ethers.verifyTypedData(result.domain, result.types, result.message, signature);
    console.log("Retrieved address:", verifyAddress);
    console.log("Actual address:", result.message.from);
    if (ethers.getAddress(verifyAddress) !== ethers.getAddress(result.message.from)) {
        console.log("Verification does not pass!");
        return 0;
    }
    const envelop = {
        address: ethers.getAddress(verifyAddress),
        sig: signature,
        data: result
    };
    console.log("\nSending this envelop");
    console.log(envelop, "\n");
    try {
        const receipt = await client.send(envelop);
        console.log("\nReceive receipt:", receipt, "\n");
        console.log("\nSuccessful!!! Check the vote on Snapshot!\n");
    } catch (e) {
        console.log("\nError:\n");
        console.log(e);
        console.log("\nSend envelop failed! \n");
    }
}

checkAndSend();