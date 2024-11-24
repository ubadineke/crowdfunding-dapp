// CampaignList.tsx
import React, { useEffect, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { fetchCampaignData } from '../utils/fetchCampaign';
import { PublicKey } from '@solana/web3.js';

interface Campaign {
  title: string;
  description: string;
  goal: string;
  raised: string;
}

interface CampaignListProps {
  programId: PublicKey; // The ID of your Solana program
}

export const CampaignList: React.FC<CampaignListProps> = ({ programId }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const { connection } = useConnection();
  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await fetchCampaignData(connection, programId);
      setCampaigns(campaigns);
    };

    fetchCampaigns();
  }, []);

  return (
    <div>
      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign, index) => (
          <li key={index}>
            <div>Title: {campaign.title}</div>
            <div>Description: {campaign.description}</div>
            <div>Goal: {campaign.goal}</div>
            <div>Raised: {campaign.raised}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
