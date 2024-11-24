import {
  Connection,
  Transaction,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
// import { Keypair, SystemProgram, Transaction, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
// import { WalletAdapter, WalletContextState } from '@solana/wallet-adapter-base';
import * as anchor from '@coral-xyz/anchor';
import { notify } from '../utils/notifications';
import { AnchorProvider, Program, web3, BN, Idl } from '@coral-xyz/anchor';

// Constants
const CAMPAIGN_SEED = 'CAMPAIGN_SEED';

// Utility to derive the campaign address (PDA)
function getCampaignAddress(title: string, creator: PublicKey, programId: PublicKey) {
  console.log(245);
  return PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode(title), anchor.utils.bytes.utf8.encode(CAMPAIGN_SEED), creator.toBuffer()],
    programId
  );
}

export const createCampaign = async (
  title: string,
  description: string,
  amount: number,
  wallet: any,
  connection: Connection,
  program: any
) => {
  if (!wallet.publicKey) {
    throw new Error('Wallet is not connected.');
  }
  console.log(wallet.publicKey);

  // let signature = '';

  try {
    // Create the transaction object
    //   const transaction = new Transaction();

    // Derive the campaign address using the provided title and wallet public key
    const [campaignAddress] = getCampaignAddress(title, wallet.publicKey, program.programId);

    //   // Create an Anchor program instance
    //   // const program = anchor.workspace.AnchorProject; // Assuming the anchor program is loaded here

    //   // Add the instruction to initialize the campaign
    //   const campaignInstruction = program.methods
    //     .initializeCampaign(title, description, new anchor.BN(amount * 1_000_000_000)) // convert SOL to Lamports
    //     .accounts({
    //       creator: wallet.publicKey,
    //       campaign: campaignAddress,
    //       systemProgram: web3.SystemProgram.programId,
    //     })
    //     .instruction(); // Create the instruction for the campaign creation

    //   // Add the instruction to the transaction
    //   transaction.add(campaignInstruction);

    //   // Send the transaction to the wallet for signing
    //   const signature = await wallet.sendTransaction(transaction, connection);

    //   // Wait for confirmation of the transaction
    //   const confirmation = await connection.confirmTransaction(signature);

    //   if (confirmation) {
    //     return { success: true, signature };
    //   } else {
    //     return { success: false, error: 'Transaction failed to confirm.' };
    //   }

    let signature: TransactionSignature = '';
    // try {

    // Create instructions to send, in this case a simple transfer
    const instructions = [
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1_000_000,
      }),
    ];

    // Get the lates block hash to use on our transaction and confirmation
    let latestBlockhash = await connection.getLatestBlockhash();

    // Create a new TransactionMessage with version and compile it to legacy
    const messageLegacy = new TransactionMessage({
      payerKey: publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions,
    }).compileToLegacyMessage();

    // Create a new VersionedTransacction which supports legacy and v0
    const transation = new VersionedTransaction(messageLegacy);

    // Send transaction and await for signature
    signature = await sendTransaction(transation, connection);

    // Send transaction and await for signature
    await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

    console.log(signature);
    notify({ type: 'success', message: 'Transaction successful!', txid: signature });
  } catch (error) {
    // console.error('Error creating campaign:', error);
    console.log(error);
    throw new Error('Error creating campaign.');
  }
};
