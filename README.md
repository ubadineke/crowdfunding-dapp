![School of Solana](https://github.com/Ackee-Blockchain/school-of-solana/blob/master/.banner/banner.png?raw=true)

# Crowdfunding Dapp

A decentralized crowdfunding application built with Rust/Anchor and deployed on the Solana blockchain.

## Features

- Create campaign
- Donate to existing campaigns
- Withdraw Funds from a campaign

## 📚 Documentation.

### Anchor Program

This documentation provides an overview of the programs implemented in this project.

Requirements

- Rust
- Solana CLI
- Anchor CLI
- Node.js
- npm

#### Usage

Creating a Campaign

```rust
 pub fn initialize_campaign(ctx: Context<CreateCampaign>, title: String, description: String, goal: u64) -> Result<()> {}
```

Donating to a Campaign

```rust
pub fn donate_to_campaign(ctx: Context<Donate>, amount: u64) -> Result<()> {};
```

Withdrawing Funds from a Campaign

```rust
pub fn withdraw_funds(ctx: Context<Withdraw>, amount: u64) -> Result<()> {};
```

#### Running the program

To build the project, run the following command:

```sh
anchor build
```

To test the programs, run the following command:

```sh
anchor test
```

To deploy the program, run the following command:

```sh
anchor deploy
```

### Frontend

Work in progress!
