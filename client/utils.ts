import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import fs from 'mz/fs';

export async function getKeypairFromFile(filePath: string): Promise<web3.Keypair> {
  const secretKeyString = await fs.readFile(filePath, {encoding: 'utf8'});
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  return web3.Keypair.fromSecretKey(secretKey);
} 

export async function initializeKeypair() {}

export async function createNewMint(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number,
) {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals
  );

  console.log(
    'Token Mint: https://explorer.solana.com/address/' + tokenMint + '?cluster=devnet'
  );

  return tokenMint;
}

export async function createNewMintToKeypair(
  connection: web3.Connection,
  payer: web3.Keypair,
  mintAuthority: web3.PublicKey,
  freezeAuthority: web3.PublicKey,
  decimals: number,
  keypair: web3.Keypair
) {
  const tokenMint = await token.createMint(
    connection,
    payer,
    mintAuthority,
    freezeAuthority,
    decimals,
    keypair
  );

  console.log(
    'Token Mint: https://explorer.solana.com/address/' + tokenMint + '?cluster=devnet'
  );

  return tokenMint;
}

export async function createTokenAccount(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey
) {
  const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    owner
  );

  console.log(
    'Token Account: https://explorer.solana.com/address/' + tokenAccount.address + '?cluster=devnet'
  );

  return tokenAccount;
}

export async function createTokenAccountToKeypair(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  owner: web3.PublicKey,
  keypair: web3.Keypair
) {
  const tokenAccount = await token.createAccount(
    connection,
    payer,
    mint,
    owner,
    keypair
  );

  console.log(
    'Token Account: https://explorer.solana.com/address/' + tokenAccount + '?cluster=devnet'
  );

  return tokenAccount;
}

export async function mintToken(
  connection: web3.Connection,
  payer: web3.Keypair,
  mint: web3.PublicKey,
  destination: web3.PublicKey,
  authority: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.mintTo(
    connection,
    payer,
    mint,
    destination,
    authority,
    amount
  );

  console.log(
    "Mint Token Transaction: https://explorer.solana.com/tx/" + transactionSignature + "?cluster=devnet"
  );
}

export async function approveDelegate(
  connection: web3.Connection,
  payer: web3.Keypair,
  account: web3.PublicKey,
  delegate: web3.PublicKey,
  owner: web3.Signer | web3.PublicKey,
  amount: number
) {
  const transactionSignature = await token.approve(
    connection,
    payer,
    account,
    delegate,
    owner,
    amount
  );

  console.log(
    "Approve Delegate Transaction: https://explorer.solana.com/tx/" + transactionSignature + "?cluster=devnet"
  );
}

export async function transferTokens(
  connection: web3.Connection,
  payer: web3.Keypair,
  source: web3.PublicKey,
  destination: web3.PublicKey,
  owner: web3.Keypair,
  amount: number
) {
  const transactionSignature = await token.transfer(
    connection,
    payer,
    source,
    destination,
    owner,
    amount
  );

  console.log(
    "Transfer Transaction: https://explorer.solana.com/tx/" + transactionSignature + "?cluster=devnet"
  );
}

export async function revokeDelegate(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    owner: web3.Signer | web3.PublicKey,
) {
    const transactionSignature = await token.revoke(
        connection,
        payer,
        account,
        owner,
  )

    console.log(
        `Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}

export async function burnTokens(
    connection: web3.Connection,
    payer: web3.Keypair,
    account: web3.PublicKey,
    mint: web3.PublicKey,
    owner: web3.Keypair,
    amount: number
) {
    const transactionSignature = await token.burn(
        connection,
        payer,
        account,
        mint,
        owner,
        amount
    )

    console.log(
        `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    )
}
