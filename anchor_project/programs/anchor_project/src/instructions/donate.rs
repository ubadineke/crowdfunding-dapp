use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;


pub fn donate(ctx: Context<Donate>,amount: u64) -> Result<()>{
  let campaign = &mut ctx.accounts.campaign;
  let donor = &ctx.accounts.donor;

  //Check if donor has enough SOL
  let donor_balance = donor.to_account_info().lamports();
    require!(
        donor_balance >= amount,
        CampaignError::InsufficientFunds
    );

  //Instruction to transfer SOL from donor to campaign
  let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
    &donor.key(), 
    &campaign.key(), 
    amount);

  //Invoke the transfer instruction
  anchor_lang::solana_program::program::invoke(
      &transfer_instruction, 
      &[
        donor.to_account_info(),
        campaign.to_account_info()
      ])?;

      campaign.raised = campaign
      .raised
      .checked_add(amount)
      .ok_or(CampaignError::Overflow)?;


Ok(())

}

#[derive(Accounts)]
pub struct Donate<'info>{
  #[account(mut)]
  pub donor: Signer<'info>,
  #[account(
      mut, 
      seeds = [
          campaign.title.as_bytes(),
          CAMPAIGN_SEED.as_bytes(), 
          campaign.creator.key().as_ref(),
        ],
        bump = campaign.bump
  )]
  pub campaign: Account<'info, Campaign>,
  pub system_program: Program<'info, System>,
}
