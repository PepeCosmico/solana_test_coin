import * as BufferLayout from '@solana/buffer-layout';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';

export async function createMintInstructions(
  amount: number,
): Promise<Buffer> {
  const bufferLayout: BufferLayout.Structure<any> = BufferLayout.struct(
    [
      BufferLayout.u8('instruction'),
      BufferLayout.u32('amount'),
    ]
  );

  const buffer = Buffer.alloc(bufferLayout.span);
    bufferLayout.encode({
        instruction: 1,
        amount: amount,
    }, buffer);

    return buffer;
}

export async function mintTransaction(
  connection: web3.Connection,
  programId: web3.PublicKey,
  ownerKeypair: web3.Keypair,
  tokenMintKeypair: web3.Keypair,
  tokenAccountKeypair: web3.Keypair,
  mintDecimals: number
) {

  //Mint transaction

  const mintData = await createMintInstructions(100 * 10 ** mintDecimals);

  const mintKeys = [
    // mint authority
    {
      pubkey: ownerKeypair.publicKey,
      isSigner: true,
      isWritable: false
    },
    // token mint
    {
      pubkey: tokenMintKeypair.publicKey,
      isSigner: true,
      isWritable: true
    },
    // token account
    {
      pubkey: tokenAccountKeypair.publicKey,
      isSigner: false,
      isWritable: true
    },
    // rent
    {
      pubkey: web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false
    },
    // token program
    {
      pubkey: token.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    }
  ];

  const transactionInstructions = new web3.TransactionInstruction({
    keys: mintKeys,
    programId,
    data: mintData
  });

  await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(transactionInstructions),
    [ownerKeypair, tokenMintKeypair]
  );
}
