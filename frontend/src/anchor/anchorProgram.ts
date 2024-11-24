import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
// import { DEVNET_PROGRAM_ID, DEVNET_RPC } from './constants';
// import { IDLData, IDLType } from '@/util/idl';
import { IDLData, IDLType } from './idlType';

export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const DEVNET_PROGRAM_ID = '5HVvxQ5M6fqmhDuPpCRSPeiWH5DdvfAxGH6Q3eMc98tj';
// export const GITHUB_LINK = 'https://github.com/gitbolt/solana-expense-tracker';

export const getProvider = (wallet: anchor.Wallet, rpc_url?: string) => {
  const opts = {
    preflightCommitment: 'processed' as anchor.web3.ConfirmOptions,
  };
  const connectionURI = DEVNET_RPC;

  const connection = new anchor.web3.Connection(connectionURI, opts.preflightCommitment);
  const provider = new anchor.AnchorProvider(connection, wallet, opts.preflightCommitment);
  return provider;
};

export const anchorProgram = (wallet: anchor.Wallet, network?: string) => {
  const provider = getProvider(wallet, network);
  const idl = IDLData as anchor.Idl;
  const program = new anchor.Program(
    idl,
    new PublicKey(DEVNET_PROGRAM_ID),
    provider
  ) as unknown as anchor.Program<IDLType>;

  return program;
};
