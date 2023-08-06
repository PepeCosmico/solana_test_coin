import * as web3 from "@solana/web3.js";
import path from 'path';
import { getKeypairFromFile, createNewMintToKeypair, createTokenAccountToKeypair } from "./utils";

const OWNER_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/owner.json");
const TOKEN_MINT_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/token_mint.json");
const TOKEN_ACCOUNT_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/token_account.json");

async function script() {
  const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  const owner = await getKeypairFromFile(OWNER_KEYPAIR_PATH);
  console.log("Owner pubkey: " + owner.publicKey);

  const mintKeypair = await getKeypairFromFile(TOKEN_MINT_KEYPAIR_PATH);
  const accountKeypair = await getKeypairFromFile(TOKEN_ACCOUNT_KEYPAIR_PATH);
  /*
  const tokenMintPubkey = await createNewMintToKeypair(
    connection,
    owner,
    owner.publicKey,
    owner.publicKey,
    2,
    mintKeypair
  );
  console.log("Created the token mint with pubkey: " + tokenMintPubkey.toBase58());
  */

  const tokenAccountPubkey = await createTokenAccountToKeypair(
    connection,
    owner,
    mintKeypair.publicKey,
    owner.publicKey,
    accountKeypair
  );
  console.log("Created the token account with pubkey: " + tokenAccountPubkey.toBase58());
}

script().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
)
