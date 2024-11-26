import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { fetchCampaignData } from '../utils/fetchCampaign';
import { Program } from '@coral-xyz/anchor';
import { AnchorProject } from '../anchor/idlType';
import {
  SystemProgram,
  PublicKey,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { notify } from 'utils/notifications';

interface Campaign {
  creator: PublicKey;
  title: string;
  description: string;
  goal: number;
  raised: number;
}

interface CampaignListProps {
  program: Program<AnchorProject>;
}

export const CampaignList: React.FC<CampaignListProps> = ({ program }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donateVisible, setDonateVisible] = useState<number | null>(null); // Track which campaign is toggled
  const [currentMode, setCurrentMode] = useState<'donate' | 'withdraw' | null>(null); // Track current mode
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [customDonation, setCustomDonation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { connection } = useConnection();
  const wallet = useWallet();
  const { sendTransaction } = useWallet();

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await fetchCampaignData(connection, program);
      setCampaigns(campaigns);
    };

    fetchCampaigns();
  }, [connection, program]);

  const getCampaignAddress = (title: string, creator: PublicKey, programId: PublicKey) => {
    return PublicKey.findProgramAddressSync(
      [anchor.utils.bytes.utf8.encode(title), anchor.utils.bytes.utf8.encode('CAMPAIGN_SEED'), creator.toBuffer()],
      programId
    );
  };

  const donationOptions = [0.1, 0.5, 2, 10];

  const toggleDonateVisible = (index: number, mode: 'donate' | 'withdraw') => {
    if (donateVisible === index && currentMode === mode) {
      setDonateVisible(null);
      setCurrentMode(null);
    } else {
      setDonateVisible(index);
      setCurrentMode(mode);
    }
  };

  const handleOptionClick = (amount: number) => {
    setSelectedDonation(selectedDonation === amount ? null : amount);
    setCustomDonation('');
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDonation(e.target.value);
    setSelectedDonation(null);
  };

  const handleCustomInputFocus = () => {
    setSelectedDonation(null);
  };

  const handleDonate = async (title: string, creatorPubkey: PublicKey, donation: number) => {
    if (!wallet || !connection) {
      alert('Wallet or connection is not available.');
      return;
    }

    setIsSubmitting(true);
    let signature: TransactionSignature = '';
    try {
      const [campaignAddress] = getCampaignAddress(title, creatorPubkey, program.programId);

      const donateInstruction = await program.methods
        .donateToCampaign(new anchor.BN(donation * 1000000000))
        .accounts({
          donor: wallet.publicKey,
          campaign: campaignAddress,
          systemProgram: SystemProgram.programId,
        } as {
          donor: PublicKey;
          campaign: PublicKey;
          systemProgram: PublicKey;
        })
        .instruction();

      const instructions = [donateInstruction];
      const latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToLegacyMessage();

      const transaction = new VersionedTransaction(messageLegacy);
      signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      notify({ type: 'success', message: 'Donation successful!', txid: signature });
    } catch (error) {
      console.error('Error during donation:', error);
      notify({ type: 'error', message: 'Donation failed. Check console for details.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWithdraw = async (title: string, creatorPubkey: PublicKey, amount: number) => {
    if (!wallet || !connection) {
      alert('Wallet or connection is not available.');
      return;
    }

    setIsSubmitting(true);
    let signature: TransactionSignature = '';
    try {
      const [campaignAddress] = getCampaignAddress(title, creatorPubkey, program.programId);

      const withdrawInstruction = await program.methods
        .withdrawFunds(new anchor.BN(amount * 1000000000))
        .accounts({
          creator: wallet.publicKey,
          campaign: campaignAddress,
          systemProgram: SystemProgram.programId,
        } as {
          creator: PublicKey;
          campaign: PublicKey;
          systemProgram: PublicKey;
        })
        .instruction();

      const instructions = [withdrawInstruction];
      const latestBlockhash = await connection.getLatestBlockhash();

      const messageLegacy = new TransactionMessage({
        payerKey: wallet.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToLegacyMessage();

      const transaction = new VersionedTransaction(messageLegacy);
      signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');
      notify({ type: 'success', message: 'Withdrawal successful!', txid: signature });
    } catch (error) {
      console.error('Error during withdrawal:', error);
      notify({ type: 'error', message: 'Withdrawal failed. Check console for details.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className={`p-4 border border-gray-300 rounded-lg relative group hover:shadow-lg transition-shadow ${
              donateVisible === index ? '' : 'h-auto'
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{campaign.title}</h3>
              <span className="text-fuchsia-500 font-bold">{`${campaign.goal} SOL`}</span>
            </div>
            <p className="text-gray-600 mt-2">{campaign.description}</p>

            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2"
                style={{
                  width: `${(campaign.raised / campaign.goal) * 100}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Raised: <span className="font-bold">{`${campaign.raised} SOL`}</span>
              </span>
              <button
                onClick={() => toggleDonateVisible(index, 'donate')}
                className="py-1 px-4 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white rounded-lg group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition duration-200 hover:from-indigo-600 hover:to-fuchsia-600"
              >
                Donate
              </button>
              {wallet.publicKey && wallet.publicKey.equals(campaign.creator) && (
                <button
                  onClick={() => toggleDonateVisible(index, 'withdraw')}
                  className="py-1 px-4 bg-gradient-to-br from-indigo-500 to-indigo-900 text-white rounded-lg group-hover:shadow-[0_0_15px_rgba(72,187,120,0.5)] transition duration-200 hover:from-indigo-800 hover:to-indigo-900"
                >
                  Withdraw
                </button>
              )}
            </div>

            {donateVisible === index && (
              <div
                className={`mt-4 py-3 px-3 border-2 rounded-xl ${
                  currentMode === 'donate' ? 'border-fuchsia-400' : 'border-indigo-600'
                }`}
              >
                <div className="flex space-x-2 mb-4">
                  {donationOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleOptionClick(amount)}
                      className={`py-2 flex-1 rounded-lg border-2 transition duration-200 
                        ${selectedDonation === amount ? 'border-indigo-600 bg-indigo-700' : 'border-gray-300'} 
                        hover:border-indigo-500`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                <div className="flex items-center w-full">
                  <input
                    type="number"
                    value={customDonation}
                    onChange={handleCustomInputChange}
                    onFocus={handleCustomInputFocus}
                    placeholder="Enter custom amount"
                    className={`py-2 px-4 text-black rounded-lg border-2 w-full sm:w-3/4 transition duration-200
                      ${customDonation ? 'border-indigo-600' : 'border-gray-300'} 
                      focus:outline-none focus:bg-indigo-500 focus:text-white`}
                  />
                  <button
                    onClick={() => {
                      if (customDonation && currentMode === 'donate') {
                        handleDonate(campaign.title, campaign.creator, parseFloat(customDonation));
                      } else if (selectedDonation && currentMode === 'donate') {
                        handleDonate(campaign.title, campaign.creator, selectedDonation);
                      } else if (currentMode === 'withdraw' && customDonation) {
                        handleWithdraw(campaign.title, campaign.creator, parseFloat(customDonation));
                      } else if (currentMode === 'withdraw' && selectedDonation) {
                        handleWithdraw(campaign.title, campaign.creator, selectedDonation);
                      } else {
                        alert('Please select or enter an amount.');
                      }
                    }}
                    className="py-2 px-4 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white rounded-lg ml-2 sm:ml-4 hover:from-indigo-600 hover:to-fuchsia-600"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignList;
