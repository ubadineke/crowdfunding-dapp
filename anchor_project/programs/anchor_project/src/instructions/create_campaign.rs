use anchor_lang::prelude::*;

use crate::errors::CampaignError;
use crate::states::*;

// pub fn create_campaign() -> Result<()>
pub fn create_campaign(
  ctx: Context<CreateCampaign>,
  title: String,
  description: String,
  goal: u64,
) -> Result<()> {
  let campaign = &mut ctx.accounts.campaign;

  //Check Title Length
  require!(
      title.as_bytes().len() <= TITLE_LENGTH,
      CampaignError::TitleTooLong
  );

  //Check Description Length
  require!(
      description.as_bytes().len() <= DESCRIPTION_LENGTH,
      CampaignError::DescriptionTooLong
  );

 // Initialize title byte array and copy data
  // let mut title_data = [0u8; TITLE_LENGTH];
  // title_data[..title.as_bytes().len()].copy_from_slice(title.as_bytes());
  // campaign.title = title_data;

 // Initialize description byte array and copy data
  // let mut description_data = [0u8; DESCRIPTION_LENGTH];
  // description_data[..description.as_bytes().len()].copy_from_slice(description.as_bytes());
  // campaign.description = description_data;

  //Setting other fields
  campaign.creator = ctx.accounts.creator.key();
  campaign.title = title;
  campaign.description = description;
  campaign.goal = goal;
  campaign.raised = 0;
  campaign.bump = ctx.bumps.campaign;

Ok(())
}


#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateCampaign<'info>{
  #[account(mut)]
  pub creator: Signer<'info>,
  #[account(
    init,
    payer = creator,
    space = 8 + Campaign::INIT_SPACE,
    seeds = [
        title.as_bytes(),
        CAMPAIGN_SEED.as_bytes(),
        creator.key().as_ref()
        ],
    bump)]
pub campaign: Account<'info, Campaign>,
pub system_program: Program<'info, System>,
}
