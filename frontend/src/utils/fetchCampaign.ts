import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProject } from 'anchor/idlType';
import { Program } from '@coral-xyz/anchor';
import idl from '../anchor/idl.json';

interface Campaign {
  title: string;
  description: string;
  goal: number;
  raised: number;
}

const programID = new PublicKey(idl.address);

export const fetchCampaignData = async (
  connection: Connection,
  program: Program<AnchorProject>
): Promise<Campaign[]> => {
  try {
    const accounts = await connection.getParsedProgramAccounts(programID);

    const campaigns = await Promise.all(
      accounts.map(async (campaign) => {
        const campaignData = await program.account.campaign.fetch(campaign.pubkey);
        return {
          title: campaignData.title,
          description: campaignData.description,
          goal: campaignData.goal.toNumber(), // Assuming `goal` is a BN (Big Number)
        };
      })
    );

    console.log('The campaigns:', campaigns);
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    throw error;
  }
};
