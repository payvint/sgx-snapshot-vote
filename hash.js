const ethers = require('ethers');
require('dotenv').config();
const fs = require('fs').promises;

let validatorAddress = "";
let proposal = "";
let space = "skalenetwotk.eth";
let choice = 0;

try {
    validatorAddress = ethers.getAddress(process.env.VALIDATOR_ADDRESS);
    console.log("Validator address:", validatorAddress);
} catch (e) {
    console.log("Validator address is incorrect!");
    console.log(e);
    return 0;
}

if (ethers.isHexString(process.env.PROPOSAL_ID, 32)) {
    proposal = process.env.PROPOSAL_ID;
    console.log("Proposal ID:", proposal);
} else {
    console.log("Proposal ID is incorrect!");
    return 0;
}

if (process.env.SPACE === "main") {
    space = "skale.eth";
    console.log("Using production with space:", space);
} else {
    console.log("Using test with space:", space);
}

if (parseInt(process.env.VOTE) === 1 || parseInt(process.env.VOTE) === 2 || parseInt(process.env.VOTE) === 3) {
    choice = process.env.VOTE;
    console.log("Vote:", choice);
} else {
    console.log("Vote is incorrect, please input VOTE in .env - 1 or 2 or 3");
    return 0;
}

const vote2Types = {
    Vote: [
        { name: 'from', type: 'address' },
        { name: 'space', type: 'string' },
        { name: 'timestamp', type: 'uint64' },
        { name: 'proposal', type: 'bytes32' },
        { name: 'choice', type: 'uint32' },
        { name: 'reason', type: 'string' },
        { name: 'app', type: 'string' },
        { name: 'metadata', type: 'string' }
    ]
};

const domain = {
    name: "snapshot",
    version: "0.1.4"
}

const vote = {
    from: validatorAddress, // validator address
    space, // space name
    timestamp: parseInt((Date.now() / 1e3).toFixed()),
    proposal, // proposal Id
    choice, // choice at the proposal (first answer - 1, second answer - 2 ...)
    reason: "",
    app: "snapshot",
    metadata: "{}"
}

console.log("\nTyped data for the vote:");
const voteTypedJSON = {domain, types: vote2Types, message: vote};

async function write(jsonObj) {
    await fs.writeFile('data/result.json', JSON.stringify(jsonObj, null, 4));
}

write(voteTypedJSON);
console.log(voteTypedJSON, "\n")

const structHash = ethers.TypedDataEncoder.hash(domain, vote2Types, vote);

console.log("\nResult hash which need to be signed by SGX:");
console.log(structHash, "\n");