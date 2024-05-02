import { useState } from "react";
import server from "./server";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState({ r: "", s: "", v: "" });

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <h4>Signature</h4>

      <label>
        r
        <input
          placeholder="paste the r part of your signature"
          value={signature.r}
          onChange={(e) => {
            setSignature({ ...signature, r: e.target.value });
          }}
        ></input>
      </label>

      <label>
        s
        <input
          placeholder="paste the s part of your signature"
          value={signature.s}
          onChange={(e) => {
            setSignature({ ...signature, s: e.target.value });
          }}
        ></input>
      </label>

      <label>
        v (or recovery)
        <input
          placeholder="paste the v part of your signature"
          value={signature.v}
          onChange={(e) => {
            setSignature({ ...signature, v: e.target.value });
          }}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
