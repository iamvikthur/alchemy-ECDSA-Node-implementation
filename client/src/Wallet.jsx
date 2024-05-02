import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>

      <div style={{ marginTop: "50px", maxWidth: "400px" }}>
        <h4>Implementation</h4>
        <p>
          This implementaion uses digital signatures to verify wallet ownership
          and to mitigate agains relay attacks, I implemented nonces. A
          signature is only valid once and after that, it's invalid. Steps to
          test:
        </p>
        <ol>
          <li>
            On your terminal, navigate to client folder into{" "}
            <i>./src/modules</i>
          </li>
          <li>
            Run <i>node generateSignature.js</i>
          </li>
          <li>
            It will ouput a Signature instance with <i>r, s and recovery</i> and
            a <i>public key</i>
          </li>
          <li>
            Copy the public key and head to the server folder, open{" "}
            <i>index.js</i> and replace it with one of the addresses in the{" "}
            <i>balances</i> array{" "}
          </li>
          <li>
            You can repeat these steps for any number of times you want to
            generate as many public keys and signatures as you want.
          </li>
          <li>
            Head over to the front end and past the address on the wallet
            section and the balance will be updated
          </li>
          <li>
            Now attempt to transfer the funds using any other address as
            recepient and input the signature values as labeled
          </li>
          <li>
            The transfer will only be able to happen once and after that, you
            will get a <i>unauthorized user</i> alert because the signature is
            expired
          </li>
          <li>
            To make another transfer you will have to generate another signature
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Wallet;
