import { Connection, PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { publicKey, u64, bool } from '@solana/buffer-layout-utils';
import { u32, u8, struct } from '@solana/buffer-layout';
import * as borsh from '@coral-xyz/borsh';

interface Campaign {
  title: string;
  description: string;
  goal: number;
  raised: number;
}

export const fetchCampaignData = async (connection: Connection, programId: PublicKey): Promise<Campaign[]> => {
  try {
    const accounts = await connection.getProgramAccounts(programId);
    const campaigns = await Promise.all(
      accounts.map(async (account) => {
        const borshAccountSchema = borsh.struct([
          borsh.publicKey('creator'),
          borsh.str('title'),
          borsh.str('description'),
          borsh.u64('goal'),
          borsh.u8('bump'),
        ]);
        console.log(account.account.data);
        const raised = await connection.getBalance(account.pubkey);
        console.log(`Amount raised: ${raised / 1000000000} SOL`);
        console.log(`Account data length: ${account.account.data.length}`);
        // console.log('Raw account data:', account.account.data.toString('hex'));

        const { creator, title, description, goal, bump } = borshAccountSchema.decode(account.account.data);
        console.log('Description:', description);
        console.log('Creator:', creator);
        console.log('Goal:', goal);

        return {
          title,
          description,
          goal,
          raised,
        };
      })
    );
    return campaigns;
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    throw error;
  }
};
// export const printCampaigns = (campaigns: Campaign[]) => {
//   campaigns.forEach((campaign, index) => {
//     console.log(`Campaign ${index + 1}:`);
//     // console.log(`Name: ${campaign.name}`);
//     console.log(`Title: ${campaign.title}`);
//     console.log(`Description: ${campaign.description}`);
//     console.log(`Goal: ${(campaign.goal / 1_000_000_000).toFixed(2)} SOL`);
//     console.log(`Raised: ${(campaign.raised / 1_000_000_000).toFixed(2)} SOL`);
//     console.log('------------------------');
//   });
// };
