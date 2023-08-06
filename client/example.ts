
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import path from 'path';
import { approveDelegate, createNewMint, createTokenAccount, getKeypairFromFile, mintToken, revokeDelegate, transferTokens, burnTokens } from "./utils";

const OWNER_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/owner.json");
const RECEIVER_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/reciver.json");

async function example() {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  const owner = await getKeypairFromFile(OWNER_KEYPAIR_PATH);

  console.log("Owner pubkey: " + owner.publicKey);

  /*
  const mint = await createNewMint(
    connection,
    owner,
    owner.publicKey,
    owner.publicKey,
    2
  );
  */

  const mint = new web3.PublicKey("FD7DQZq2JTUM9EhooUKZu5uSsf5psyEhjKjbHemihbS7");

  const mintInfo = await token.getMint(connection, mint);

  console.log("Mint pubkey: " + mint.toString());

  const tokenAccount = await createTokenAccount(
    connection,
    owner,
    mint,
    owner.publicKey
  );

  console.log("Token account: " + tokenAccount.address);

  mintToken(
    connection,
    owner,
    mint,
    tokenAccount.address,
    owner,
    100 * 10 ** mintInfo.decimals
  );

  console.log("Minted 100 tokens to token with address: " + tokenAccount.address);

  const receiver = await getKeypairFromFile(RECEIVER_KEYPAIR_PATH);
  const receiverTokenAccount = await createTokenAccount(
    connection,
    owner,
    mint,
    receiver.publicKey
  );

  const delegate = web3.Keypair.generate();

  await approveDelegate(
    connection,
    owner,
    tokenAccount.address,
    delegate.publicKey,
    owner.publicKey,
    50 * 10 ** mintInfo.decimals
  );

  await transferTokens(
    connection,
    owner,
    tokenAccount.address,
    receiverTokenAccount.address,
    delegate,
    50 * 10 ** mintInfo.decimals
  );

  await revokeDelegate(
    connection,
    owner,
    tokenAccount.address,
    owner.publicKey
  );

  await burnTokens(
    connection,
    owner,
    tokenAccount.address,
    mint,
    owner,
    25 * 10 ** mintInfo.decimals
  );
}

example().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
);
