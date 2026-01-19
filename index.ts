import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const connection = new Connection("http://127.0.0.1:8899");
async function main() {
  const keypair = new Keypair();

  const dataAccount = new Keypair();

  const bal = await connection.requestAirdrop(keypair.publicKey, 3000000000);
  await connection.confirmTransaction(bal);
  const balance = await connection.getBalance(keypair.publicKey);

  const instructon = SystemProgram.createAccount({
    fromPubkey: keypair.publicKey,
    newAccountPubkey: dataAccount.publicKey,
    lamports: 1000000000,
    space: 8,
    programId: SystemProgram.programId,
  });

  const tx = new Transaction().add(instructon);
  tx.feePayer = keypair.publicKey;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  await connection.sendTransaction(tx, [keypair, dataAccount]);
  console.log(dataAccount.publicKey.toBase58());
}

main();
