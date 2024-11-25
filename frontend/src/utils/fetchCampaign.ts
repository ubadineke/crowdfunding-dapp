import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProject } from 'anchor/idlType';
import { Program } from '@coral-xyz/anchor';
import idl from '../anchor/idl.json';

interface Campaign {
  creator: PublicKey;
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
    // const him = await program.account.campaign.all();
    const accounts = await connection.getParsedProgramAccounts(programID);

    const campaigns = await Promise.all(
      accounts.map(async (campaign) => {
        const campaignData = await program.account.campaign.fetch(campaign.pubkey);
        const [pda] = await PublicKey.findProgramAddress(
          [
            Buffer.from(campaignData.title), // Seed 1: Campaign title as bytes
            Buffer.from('CAMPAIGN_SEED'), // Seed 2: Static seed string
            campaignData.creator.toBuffer(), // Seed 3: Creator's public key as bytes
          ],
          programID
        );
        // console.log(`PDA for campaign ${campaignData.title}:`, pda.toBase58());
        return {
          creator: campaignData.creator,
          title: campaignData.title,
          description: campaignData.description,
          goal: campaignData.goal.toNumber() / 1000000000, // Assuming `goal` is a BN (Big Number)
          raised: campaignData.raised.toNumber() / 1000000000,
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
