const express = require("express");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const { ethers } = require("ethers");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = [
  {
    address:
      "03d31a92a038ce2aec3a1c18b9d4afeb26934ef05514341a20bf9b7efb46194c8f",
    balance: 100,
    nonce: 0,
  },
  {
    address:
      "03da986ca70f48458fcf0447ef29df77130a857b5602801178a8cf7ba14ac71ecd",
    balance: 50,
    nonce: 0,
  },
  {
    address:
      "03adee8adaf4c96dad917a79117cddce7a27bebc1616ac016f3c3e6bf1ce8962ad",
    balance: 70,
    nonce: 0,
  },
];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const addressObj = searchByAddress(address);
  const balance = addressObj.balance || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { signature, sender, recipient, amount } = req.body;

  const senderObj = searchByAddress(sender);
  const recipientObj = searchByAddress(recipient);

  const message = "transfer funds" + senderObj.nonce;

  try {
    // verify signature
    const isValid = await verifySignature(
      signature,
      senderObj.address,
      message
    );

    if (!isValid) {
      res.status(403).send({ message: "Unauthorized user" });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(403).send({ message: "Error with signature provided" });
    return;
  }

  setInitialBalance(senderObj);
  setInitialBalance(recipientObj);

  if (senderObj.balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    senderObj.balance -= amount;
    recipientObj.balance += amount;
    senderObj.nonce++;
    res.send({ balance: senderObj.balance });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(addressObj) {
  if (!addressObj.balance) {
    addressObj.balance = 0;
  }
}

async function verifySignature(signature, publicKey, message) {
  try {
    const { r, s, v } = signature; // destructure the signature
    // console.log(BigInt(r), BigInt(s), BigInt(v));
    const signatureInstance = new secp.secp256k1.Signature(
      BigInt(r.slice(0, -1)),
      BigInt(s.slice(0, -1)),
      BigInt(v.slice(0, -1))
    ); // create signature instance
    const messageHash = toHex(utf8ToBytes(message)); // hash the message
    const isValid = secp.secp256k1.verify(
      signatureInstance,
      messageHash,
      publicKey
    ); // check if signature is valid
    return isValid;
  } catch (error) {
    throw new Error(error);
  }
}

function searchByAddress(addr) {
  return balances.find((obj) => obj["address"] === addr) || { address: addr };
}
