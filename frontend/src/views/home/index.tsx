import { FC, useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program, web3, BN, Idl } from '@coral-xyz/anchor';
import idl from '../../anchor/idl.json';
import { CreateCampaignModal } from '../../components/CreateCampaignModal';
import { createCampaign } from 'utils/createCampaign';
import { notify } from '../../utils/notifications';
import { CampaignList } from 'components/CampaignList';
import * as anchor from '@coral-xyz/anchor';
import {
  Keypair,
  SystemProgram,
  PublicKey,
  Transaction,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [program, setProgram] = useState<Program | null>(null);
  const [programId, setProgramId] = useState<PublicKey | null>(null);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const provider = new AnchorProvider(connection, wallet as any, {});
      const program = new Program(idl as Idl, provider);
      const { programId } = program;
      setProgram(program);
      setProgramId(programId);
    }
  }, [wallet.connected, wallet.publicKey, connection]);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // Utility to derive the campaign address (PDA)
  const getCampaignAddress = (title: string, creator: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(title), anchor.utils.bytes.utf8.encode('CAMPAIGN_SEED'), creator.toBuffer()],
      programId
    );
  };

  // Create campaign function, using the utility function
  const handleCreateCampaign = async (title: string, description: string, amount: number) => {
    if (!wallet || !connection) {
      alert('Wallet or connection is not available.');
      return;
    }

    setIsSubmitting(true);

    let signature: TransactionSignature = '';
    try {
      // Create instructions to send, in this case a simple transfer
      const [campaignAddress] = getCampaignAddress(title, wallet.publicKey, program.programId);

      const initializeCampaignInstruction = await program.methods
        .initializeCampaign(title, description, new anchor.BN(amount * 1_000_000_000)) // convert SOL to Lamports
        .accounts({
          creator: wallet.publicKey,
          campaign: campaignAddress,
          systemProgram: SystemProgram.programId,
        })
        .instruction();

      const instructions = [
        initializeCampaignInstruction,
      ];

      // Get the lates block hash to use on our transaction and confirmation
      let latestBlockhash = await connection.getLatestBlockhash();

      // Create a new TransactionMessage with version and compile it to legacy
      const messageLegacy = new TransactionMessage({
        payerKey: wallet.publicKey,
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
      const result = await createCampaign(title, description, amount, wallet, connection, program);

      if (result.success) {
        alert('Campaign created successfully!');
      } else {
        alert(result.error || 'Transaction failed.');
      }
    } catch (error) {
      console.log(error);
      console.error('Error in creating campaign:', error);
      // alert('Error creating campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <div className="flex items-end justify-end w-full py-2 px-3 rounded-lg">
          <button className=" bg-gradient-to-tr from-purple-900 to-purple-700" onClick={openModal}>
            + Create Camapign
          </button>
        </div>
        <div className="mt-6">
          <h1 className="text-center text-5xl md:pl-12 font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            Crowdfunding Dapp
          </h1>
        </div>
        <h4 className="md:w-full text-2x1 md:text-4xl text-center text-slate-300 my-2">
          <p className="text-slate-500 text-2x1 leading-relaxed">Simple app for creating and donating to campaigns.</p>
          {/* <p className="text-slate-500 text-2x1 leading-relaxed">Full-stack Solana applications made easy.</p> */}
        </h4>
        {/* Modal Component */}
        <CreateCampaignModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleCreateCampaign} // Pass the onSubmit function
        />
        {programId && <CampaignList programId={programId} />}
      </div>
    </div>
  );
};