use anchor_lang::prelude::*;

use crate::states::*;
use crate::errors::*;

pub fn withdraw(ctx: Context<Withdraw>, amount:u64) -> Result<()> {
  let campaign = &mut ctx.accounts.campaign;
  let creator = &ctx.accounts.creator;

    //Only the creator of the program should be able to withdraw
    require!(
      campaign.creator == *creator.key,
      CampaignError::UnauthorizedWithdrawal
    );

    //Check if the amount to be withdrawn is not more than amount raised and also not equal to 0
    require!(
      campaign.raised > 0,
      CampaignError::NoFundsRaisedYet
    );

    require!(
      campaign.raised >= amount,
      CampaignError::AmountRaisedNotEnough
    );

    
    // Transfer lamports directly using try_borrow_mut_lamports()
    **campaign.to_account_info().try_borrow_mut_lamports()? = campaign
        .to_account_info()
        .lamports()
        .checked_sub(amount)
        .ok_or(ProgramError::InsufficientFunds)?;
    
    **creator.to_account_info().try_borrow_mut_lamports()? = creator
        .to_account_info()
        .lamports()
        .checked_add(amount)
        .ok_or(CampaignError::Overflow)?;

       // Update campaign's amount raised after successful transfer
       campaign.raised = campaign
       .raised
       .checked_sub(amount)
       .ok_or(CampaignError::Overflow)?;
   

Ok(())

}

#[derive(Accounts)]
pub struct Withdraw<'info>{
  #[account(mut)]
  pub creator: Signer<'info>,
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
