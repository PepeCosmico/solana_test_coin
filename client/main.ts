import * as web3 from "@solana/web3.js";
import path from 'path';
import { createTokenAccount, getKeypairFromFile } from "./utils";
import { createSwapInstructions, swapTransaction } from "./swap";
import { TOKEN_PROGRAM_ID, getMint } from "@solana/spl-token";
import { mintTransaction } from './mint';

const OWNER_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/owner.json");
const RECEIVER_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/reciver.json");
const PROGRAM_KEYPAIR_PATH = path.resolve(__dirname, "../target/program/pepo_coin-keypair.json");
const TOKEN_MINT_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/token_mint.json");
const TOKEN_ACCOUNT_KEYPAIR_PATH = path.resolve(__dirname, "../accounts/token_account.json");

let connection: web3.Connection;
let ownerKeypair: web3.Keypair;
let receiverKeypair: web3.Keypair;
let programKeypair: web3.Keypair;
let programId: web3.PublicKey;
let tokenAccountKeypair: web3.Keypair;
let tokenMintKeypair: web3.Keypair;

async function main() {
  connection = new web3.Connection(web3.clusterApiUrl('devnet'));
  console.log("Connected to devnet");

  ownerKeypair = await getKeypairFromFile(OWNER_KEYPAIR_PATH);
  console.log("Owner keypair set to keypair with pubkey: " + ownerKeypair.publicKey);


  programKeypair = await getKeypairFromFile(PROGRAM_KEYPAIR_PATH);
  programId = programKeypair.publicKey;
  console.log("Program id set to: " + programId.toBase58());

  tokenAccountKeypair = await getKeypairFromFile(TOKEN_ACCOUNT_KEYPAIR_PATH);
  tokenMintKeypair = await getKeypairFromFile(TOKEN_MINT_KEYPAIR_PATH);
  const mintInfo = await getMint(connection, tokenMintKeypair.publicKey);

  receiverKeypair = await getKeypairFromFile(RECEIVER_KEYPAIR_PATH);

  //Swap transaction
  await swapTransaction(
    connection,
    programId,
    tokenMintKeypair,
    tokenAccountKeypair,
    receiverKeypair,
    ownerKeypair
  );

  //Mint transaction
  await mintTransaction(
    connection,
    programId,
    ownerKeypair,
    tokenMintKeypair,
    tokenAccountKeypair,
    mintInfo.decimals
  );
  
}

main().then(
  () => process.exit(),
  err => {
    console.error(err);
    process.exit(-1);
  }
);
