use anchor_lang::prelude::*;

pub const TITLE_LENGTH: usize = 32;
pub const DESCRIPTION_LENGTH: usize = 200;
pub const CAMPAIGN_SEED: &str = "CAMPAIGN_SEED";
pub const DONATION_SEED: &str = "DONATION_SEED";

#[account]
#[derive(InitSpace)]
pub struct Campaign {
  pub creator: Pubkey,
  #[max_len(32)]
  pub title: String,
  #[max_len(200)]
  pub description: String,
  pub goal: u64,
  pub raised: u64,
  pub bump: u8,
}