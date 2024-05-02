import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const privateKey = secp.secp256k1.utils.randomPrivateKey();
const publicKey = secp.secp256k1.getPublicKey(privateKey);

var nonce = 0;

const message = "transfer funds" + nonce;
const messageHash = toHex(utf8ToBytes(message));

const signature = secp.secp256k1.sign(messageHash, privateKey);

console.log(signature);
console.log("Public Key", toHex(publicKey));

// In a production environment,
// store the privateKey, publicKey and nonce
// then increment the nonce when next you are signing
// with your private key
