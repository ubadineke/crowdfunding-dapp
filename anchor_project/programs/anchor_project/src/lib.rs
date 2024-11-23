use crate::instructions::*;
use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod states;

declare_id!("BAAzMV36Q9Uy6Ygg7VTShxRYQeBhoTDTQK5T6UUekCzp");

#[program]
pub mod anchor_project {

    use super::*;
    
    //create campaign
    pub fn initialize_campaign(ctx: Context<CreateCampaign>, title: String, description: String, goal: u64) -> Result<()> {
        create_campaign(ctx, title, description, goal)
    }

    pub fn donate_to_campaign(ctx: Context<Donate>, amount: u64) -> Result <()>{
        donate(ctx, amount)

    }

    pub fn withdraw_funds(ctx: Context<Withdraw>, amount: u64) -> Result <()>{
        withdraw(ctx, amount)
    }
    
    //view all campaigns
    //donate to campaign
    //withdraw funds
    //history of donations

}