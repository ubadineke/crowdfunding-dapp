import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';

import { AnchorProject } from './idlType';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

const programId = new PublicKey('5HVvxQ5M6fqmhDuPpCRSPeiWH5DdvfAxGH6Q3eMc98tj');
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

useEffect(() => {
  if (wallet.connected && wallet.publicKey) {
    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = new Program(idl as Idl, provider);
    setProgram(program);
  }
}, [wallet.connected, wallet.publicKey, connection]);

// Initialize the program interface with the IDL, program ID, and connection.
// This setup allows us to interact with the on-chain program using the defined interface.
export const program = new Program<Counter>(IDL, programId, {
  connection,
});

export const [counterPDA] = PublicKey.findProgramAddressSync([Buffer.from('counter')], program.programId);

// This is just a TypeScript type for the Counter data structCounterure based on the IDL
// We need this so TypeScript doesn't yell at us
export type CounterData = IdlAccounts<Counter>['counter'];
