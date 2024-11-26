use anchor_lang::prelude::*;

#[error_code]
pub enum CampaignError {
    #[msg("Cannot initialize, title too long")]
    TitleTooLong,
    #[msg("Cannot initialize, description too long")]
    DescriptionTooLong,
    #[msg("Insufficient funds in donor account")]
    InsufficientFunds,
    #[msg("Overflow occurred while adding to the campaign amount.")]
    Overflow,
    #[msg("Nonce provided doesn't match current state.")]
    InvalidNonce,
    #[msg("Amount raised not up to requested.")]
    AmountRaisedNotEnough,
    #[msg("Amount raised currently is 0")]
    NoFundsRaisedYet,
    #[msg("Withdrawal not allowed! You don't own this campaign")]
    UnauthorizedWithdrawal,
    #[msg("Bump value is missing.")]
    MissingBump,
}