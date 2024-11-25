import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { fetchCampaignData } from '../utils/fetchCampaign';
import { PublicKey } from '@solana/web3.js';
import { Program } from '@coral-xyz/anchor';
import { AnchorProject } from 'anchor/idlType';

interface Campaign {
  title: string;
  description: string;
  goal: string;
  raised: string;
}

interface CampaignListProps {
  program: Program<AnchorProject>; // The ID of your Solana program
}

export const CampaignList: React.FC<CampaignListProps> = ({ program }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donateVisible, setDonateVisible] = useState<number | null>(null); // Track which campaign is toggled
  const [selectedDonation, setSelectedDonation] = useState<number | null>(null);
  const [customDonation, setCustomDonation] = useState<string>('');

  const { connection } = useConnection();
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await fetchCampaignData(connection, program);
      setCampaigns(campaigns);
    };

    fetchCampaigns();
  }, []);

  // Predefined donation options
  const donationOptions = [0.1, 0.5, 2, 10];

  const toggleDonateVisible = (index: number) => {
    setDonateVisible(donateVisible === index ? null : index); // Toggle visibility for clicked card, close the rest
  };

  const handleOptionClick = (amount: number) => {
    // If the same option is clicked again, deselect it
    setSelectedDonation(selectedDonation === amount ? null : amount);
    setCustomDonation(''); // Clear custom input if a predefined option is selected
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDonation(e.target.value);
    setSelectedDonation(null); // Clear predefined option if custom input is used
  };

  const handleCustomInputFocus = () => {
    setSelectedDonation(null); // Deselect any predefined option if custom input is focused
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <div
            key={index}
            className={`p-4 border border-gray-300 rounded-lg relative group hover:shadow-lg transition-shadow ${
              donateVisible === index ? '' : 'h-auto' // Ensure the card behaves normally if not active
            }`}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{campaign.title}</h3>
              <span className="text-fuchsia-500 font-bold">{`${campaign.goal} SOL`}</span>
            </div>
            <p className="text-gray-600 mt-2">{campaign.description}</p>

            {/* Progress bar */}
            <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2"
                style={{
                  width: `${(parseFloat(campaign.raised) / parseFloat(campaign.goal)) * 100}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">
                Raised: <span className="font-bold">{`${campaign.raised} SOL`}</span>
              </span>

              {/* Donate button */}
              <button
                onClick={() => toggleDonateVisible(index)}
                className="py-1 px-4 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white rounded-lg group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition duration-200 hover:from-indigo-600 hover:to-fuchsia-600"
              >
                Donate
              </button>
            </div>

            {/* Donation Options (Only for the active card) */}
            {donateVisible === index && (
              <div className="mt-4">
                {/* Predefined Donation Options */}
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

                {/* Custom Donation Input */}
                <div className="flex items-center w-full">
                  <input
                    type="number"
                    value={customDonation}
                    onChange={handleCustomInputChange}
                    onFocus={handleCustomInputFocus} // Deselect any predefined option when the input is focused
                    placeholder="Enter custom amount"
                    className={`py-2 px-4 text-black rounded-lg border-2 w-full sm:w-3/4 transition duration-200
                      ${customDonation ? 'border-indigo-600' : 'border-gray-300'} 
                      focus:outline-none focus:bg-indigo-500 focus:text-white`}
                  />
                  <button
                    onClick={() => {}} // For now, this will be empty for later submission logic
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
