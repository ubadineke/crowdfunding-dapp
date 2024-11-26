import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { AnchorProject } from '../target/types/anchor_project';
import { PublicKey } from '@solana/web3.js';
import { assert } from 'chai';

const CAMPAIGN_SEED = 'CAMPAIGN_SEED';

describe('Crowdfunding DApp', () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const testAcc = anchor.web3.Keypair.generate();
  const secondAcc = anchor.web3.Keypair.generate();

  const campaignTitle = 'Marrow Surgery';
  const campaignDescripton = 'Surgery for a woman out there with bone marrow issues.';
  const goal = new anchor.BN(40 * 1_000_000_000);

  const program = anchor.workspace.AnchorProject as Program<AnchorProject>;
  describe('Create Campaign!', () => {
    it('Creates a new campaign successfully', async () => {
      await airdrop(provider.connection, testAcc.publicKey);

      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

      const tx = await program.methods
        .initializeCampaign(campaignTitle, campaignDescripton, goal)
        .accounts({
          creator: testAcc.publicKey,
          campaign: campaign_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([testAcc])
        .rpc({ commitment: 'confirmed' });
    });
  });

  describe('Donate to campaign', async () => {
    it('Donation successful', async () => {
      await airdrop(provider.connection, secondAcc.publicKey);
      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

      //Derive Donation amount
      const donationAmount = new anchor.BN(0.5 * 1_000_000_000); // in LAMPORTS

      // Simulate donation
      const tx = await program.methods
        .donateToCampaign(donationAmount) // Pass SOL amount directly
        .accounts({
          donor: secondAcc.publicKey,
          campaign: campaign_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([secondAcc])
        .rpc({ commitment: 'confirmed' });
    });
  });

  describe('Withdraw From Campaign', async () => {
    it('Withdrawal successful', async () => {
      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

      // Derive the withdrawal amount (simulate a withdrawal)
      const withdrawAmount = new anchor.BN(0.1 * 1_000_000_000); // in LAMPORTS

      // Simulate withdrawal to creator
      const tx = await program.methods
        .withdrawFunds(withdrawAmount)
        .accounts({
          creator: testAcc.publicKey,
          campaign: campaign_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([testAcc])
        .rpc({ commitment: 'confirmed' });
    });

    // Unhappy Test
    it("Cannot withdraw from someone else's campaign", async () => {
      let should_fail = 'This Should Fail';
      try {
        const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

        // Derive the withdrawal amount (simulate a withdrawal)
        const withdrawAmount = new anchor.BN(0.1 * 1_000_000_000); // in LAMPORTS

        // Simulate withdrawal to creator
        const tx = await program.methods
          .withdrawFunds(withdrawAmount)
          .accounts({
            creator: secondAcc.publicKey,
            campaign: campaign_pkey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .signers([secondAcc])
          .rpc({ commitment: 'confirmed' });
      } catch (error) {
        const err = anchor.AnchorError.parse(error.logs);
        assert.strictEqual(err.error.errorCode.code, 'UnauthorizedWithdrawal');
        should_fail = 'Failed';
      }
      assert.strictEqual(should_fail, 'Failed');
    });
  });

  //Try to withdraw the raised money when you're not the creator
});

// ---------------------------------------------------------------------------------

// ---------------------------------------------------------------------------------

//-----------------------------UTILITY FUNCTIONS---------------------------------

//AIRDROP SOL
async function airdrop(connection: any, address: any, amount = 1000000000) {
  await connection.confirmTransaction(await connection.requestAirdrop(address, amount), 'confirmed');
}

//DERIVE PDA
function getCampaignAddress(title: string, author: PublicKey, programID: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode(title), anchor.utils.bytes.utf8.encode(CAMPAIGN_SEED), author.toBuffer()],
    programID
  );
}

//FETCH ALL CREATED CAMPAIGNS
async function fetchAllCampaigns(program) {
  const campaigns = await program.account.campaign.all();
  // console.log(1, campaigns);
  console.log(
    campaigns.map((campaign) => ({
      creator: campaign.account.creator.toBase58(),
      title: campaign.account.title,
      description: campaign.account.description,
      goal: campaign.account.goal.toNumber(),
      raised: campaign.account.raised.toNumber(),
      // bump: campaign.account.bump,
    }))
  );
}
