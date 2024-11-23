import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { AnchorProject } from '../target/types/anchor_project';
import { PublicKey } from '@solana/web3.js';
import { assert } from 'chai';

// Configure the client to use the local cluster.

const CAMPAIGN_SEED = 'CAMPAIGN_SEED';

describe('Crowdfunding DApp', () => {
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(provider);
  const testAcc = anchor.web3.Keypair.generate();
  const secondAcc = anchor.web3.Keypair.generate();

  const campaignTitle = 'Marrow Surgery';
  const campaignDescripton = 'Surgery for a woman out there with bone marrow issues.';
  const goal = new anchor.BN(40 * 1_000_000_000);

  const campaignTitle2 = 'Fees Payment';
  const campaignDescripton2 = 'Money for school fees.';
  const goal2 = new anchor.BN(10 * 1_000_000_000);

  const program = anchor.workspace.AnchorProject as Program<AnchorProject>;
  describe('Create Campaign!', () => {
    it('Creates a new campaign successfully', async () => {
      await airdrop(provider.connection, testAcc.publicKey);

      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);
      // Add your test here

      const tx = await program.methods
        .initializeCampaign(campaignTitle, campaignDescripton, goal)
        .accounts({
          creator: testAcc.publicKey,
          campaign: campaign_pkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([testAcc])
        .rpc({ commitment: 'confirmed' });
      console.log('Your transaction signature', tx);
    });
  });

  // describe('Another Create Campaign!', () => {
  //   it('Creates a new campaign successfully', async () => {
  //     await airdrop(provider.connection, testAcc.publicKey);
  //     const [campaign_pkey] = getCampaignAddress(campaignTitle2, testAcc.publicKey, program.programId);
  //     // Add your test here

  //     const tx = await program.methods
  //       .initializeCampaign(campaignTitle2, campaignDescripton2, goal2)
  //       .accounts({
  //         creator: testAcc.publicKey,
  //         campaign: campaign_pkey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([testAcc])
  //       .rpc({ commitment: 'confirmed' });
  //     console.log('Your transaction signature', tx);

  //     // await fetchAllCampaigns(program);
  //   });
  // });

  describe('Donate to campaign', async () => {
    it('Donation successful', async () => {
      await airdrop(provider.connection, secondAcc.publicKey);
      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

      // Check balance of secondAcc (donor)
      const donorBalanceBefore = await provider.connection.getBalance(secondAcc.publicKey);
      console.log('Donor balance before donation:', donorBalanceBefore);

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

      console.log('Donation transaction signature:', tx);

      // Check the donor's balance after donation
      const donorBalanceAfter = await provider.connection.getBalance(secondAcc.publicKey);
      console.log('Donor balance after donation:', donorBalanceAfter);

      // Assert that the donor's balance decreased by the donation amount
      const balanceChange = donorBalanceBefore - donorBalanceAfter;
      assert.isAtLeast(
        balanceChange,
        donationAmount.toNumber(),
        'Balance change should be at least the donation amount in lamports'
      );

      // Fetch the updated campaign details
      // const campaign = await program.account.campaign.fetch(campaign_pkey);
      // console.log(`Updated campaign:\nGoal: ${campaign.goal.toNumber() / 1000000000} SOL`);
      // console.log(`Amount Raised in Campaign: ${campaign.amountRaised.toNumber() / 1000000000} SOL`);
      // console.log(111, campaign.lam)
      // Fetch the account info for the PDA
      const accountInfo = await provider.connection.getAccountInfo(campaign_pkey);
      // console.log(4344, accountInfo);

      if (accountInfo === null) {
        throw new Error('Account not found');
      }

      // Account balance (lamports) is part of the account info data
      const balance = accountInfo.lamports; // This will give you the balance in lamports
      console.log('PDA Balance:', balance);
      await fetchAllCampaigns(program);
    });
  });

  // describe('Donate Again to campaign', async () => {
  //   it(' Second Donation successful ', async () => {
  //     await airdrop(provider.connection, secondAcc.publicKey);
  //     const [campaign_pkey] = getCampaignAddress(campaignTitle2, testAcc.publicKey, program.programId);

  //     // Check balance of secondAcc (donor)
  //     const donorBalanceBefore = await provider.connection.getBalance(secondAcc.publicKey);
  //     console.log('Donor balance before donation:', donorBalanceBefore);

  //     //Derive Donation amount
  //     const donationAmount = new anchor.BN(0.2 * 1_000_000_000); // in LAMPORTS

  //     // Simulate donation
  //     const tx = await program.methods
  //       .donateToCampaign(donationAmount) // Pass SOL amount directly
  //       .accounts({
  //         donor: secondAcc.publicKey,
  //         campaign: campaign_pkey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([secondAcc])
  //       .rpc({ commitment: 'confirmed' });

  //     console.log('Donation transaction signature:', tx);

  //     // Check the donor's balance after donation
  //     const donorBalanceAfter = await provider.connection.getBalance(secondAcc.publicKey);
  //     console.log('Donor balance after donation:', donorBalanceAfter);

  //     // Assert that the donor's balance decreased by the donation amount
  //     const balanceChange = donorBalanceBefore - donorBalanceAfter;
  //     assert.isAtLeast(
  //       balanceChange,
  //       donationAmount.toNumber(),
  //       'Balance change should be at least the donation amount in lamports'
  //     );

  //     // Fetch the updated campaign details
  //     // const campaign = await program.account.campaign.fetch(campaign_pkey);
  //     // console.log(`Updated campaign:\nGoal: ${campaign.goal.toNumber() / 1000000000} SOL`);
  //     // console.log(`Amount Raised in Campaign: ${campaign.amountRaised.toNumber() / 1000000000} SOL`);

  //     // await fetchAllCampaigns(program);
  //     // console.log(campaigns);
  //   });
  // });

  describe('Withdraw From Campaign', async () => {
    it('Withdrawal Successful', async () => {
      const [campaign_pkey] = getCampaignAddress(campaignTitle, testAcc.publicKey, program.programId);

      const creatorBalanceBefore = await provider.connection.getBalance(testAcc.publicKey);
      console.log('Creator balance before withdrawal:', creatorBalanceBefore);

      // Derive the withdrawal amount (simulate a withdrawal)
      const withdrawAmount = new anchor.BN(0.1 * 1_000_000_000); // in LAMPORTS

      // Simulate withdrawal to creator
      const tx = await program.methods
        .withdrawFunds(withdrawAmount) // Use the withdraw method here
        .accounts({
          creator: testAcc.publicKey, // Creator signs the transaction
          campaign: campaign_pkey, // Campaign is the PDA
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([testAcc]) // The creator is signing the transaction
        .rpc({ commitment: 'confirmed' });

      console.log('Withdrawal transaction signature:', tx);

      // Check the creator's balance after withdrawal
      const creatorBalanceAfter = await provider.connection.getBalance(testAcc.publicKey);
      console.log('Creator balance after withdrawal:', creatorBalanceAfter);
    });
  });
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
      // bump: campaign.account.bump,
    }))
  );
}
function getDonationAddress(
  campaign: PublicKey,
  donor: PublicKey,
  nonce: number,
  programID: PublicKey
): [PublicKey, number] {
  const nonceBytes = Buffer.from(new anchor.BN(nonce).toArray('le', 8));

  return PublicKey.findProgramAddressSync(
    [campaign.toBuffer(), anchor.utils.bytes.utf8.encode('DONATION_SEED'), donor.toBuffer(), nonceBytes],
    programID
  );
}

// const balance = await provider.connection.getBalance(testAcc.publicKey);

// console.log('Balance of testAcc (in Lamports):', balance);

// // Convert Lamports to SOL
// const balanceInSol = balance / anchor.web3.LAMPORTS_PER_SOL;
// console.log('Balance of testAcc (in SOL):', balanceInSol);

// // Assert the balance (for testing purposes, optional)
// if (balance === 0) {
//   throw new Error('Balance is 0 after airdrop!');
// }
