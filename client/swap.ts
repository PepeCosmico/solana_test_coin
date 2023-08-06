import * as BufferLayout from '@solana/buffer-layout';
import * as web3 from '@solana/web3.js';
import * as token from '@solana/spl-token';
import { createTokenAccount } from './utils';

export async function createSwapInstructions(
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
        instruction: 0,
        amount: amount,
    }, buffer);

    return buffer;
}

export async function swapTransaction(
  connection: web3.Connection,
  programId: web3.PublicKey,
  tokenMintKeypair: web3.Keypair,
  tokenAccountKeypair: web3.Keypair,
  receiverKeypair: web3.Keypair,
  ownerKeypair: web3.Keypair,
) {
  const receiverTokenAccount = await createTokenAccount(
    connection,
    ownerKeypair,
    tokenMintKeypair.publicKey,
    receiverKeypair.publicKey
  );

  const mintInfo = await token.getMint(connection, tokenMintKeypair.publicKey);
    //Swap transaction
  const swapData = await createSwapInstructions(10 * 10 ** mintInfo.decimals);

  const swapKeys = [
    // token program
    {
      pubkey: token.TOKEN_PROGRAM_ID,
      isSigner: false,
      isWritable: false
    },
    // source
    {
      pubkey: tokenAccountKeypair.publicKey,
      isSigner: false,
      isWritable: true
    },
    // destination
    {
      pubkey: receiverTokenAccount.address,
      isSigner: false,
      isWritable: true
    },
    {
      pubkey: ownerKeypair.publicKey,
      isSigner: true,
      isWritable: true
    },
  ];

  const swapTramsactionInstruction = new web3.TransactionInstruction({
    keys: swapKeys,
    programId,
    data: swapData
  });

  await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(swapTramsactionInstruction),
    [ownerKeypair]
  );

}
