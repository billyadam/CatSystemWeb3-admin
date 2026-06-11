import {
	Connection,
	PublicKey,
	Transaction,
	VersionedTransaction,
} from "@solana/web3.js";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";
import type { ConnectedStandardSolanaWallet } from "@privy-io/js-sdk-core";

import idl from "@/lib/idl/cat_system.json";

const RPC_ENDPOINT = "https://api.devnet.solana.com";

class PrivyAnchorWallet {
	readonly publicKey: PublicKey;

	constructor(private readonly wallet: ConnectedStandardSolanaWallet) {
		this.publicKey = new PublicKey(wallet.address);
	}

	async signTransaction<T extends Transaction | VersionedTransaction>(
		tx: T,
	): Promise<T> {
		const bytes =
			tx instanceof VersionedTransaction
				? tx.serialize()
				: tx.serialize({ requireAllSignatures: false });

		const { signedTransaction } = await this.wallet.signTransaction({
			transaction: bytes,
		});

		return (
			tx instanceof VersionedTransaction
				? VersionedTransaction.deserialize(signedTransaction)
				: Transaction.from(signedTransaction)
		) as T;
	}

	async signAllTransactions<T extends Transaction | VersionedTransaction>(
		txs: T[],
	): Promise<T[]> {
		return Promise.all(txs.map((tx) => this.signTransaction(tx)));
	}
}

export function createCatProgram(wallet: ConnectedStandardSolanaWallet) {
	const connection = new Connection(RPC_ENDPOINT, "confirmed");
	const provider = new AnchorProvider(connection, new PrivyAnchorWallet(wallet) as any, {
		commitment: "confirmed",
	});
	return new Program(idl as Idl, provider);
}

export function createReadOnlyCatProgram() {
	const connection = new Connection(RPC_ENDPOINT, "confirmed");
	const dummyWallet = {
		publicKey: PublicKey.default,
		signTransaction: async <T>(tx: T) => tx,
		signAllTransactions: async <T>(txs: T[]) => txs,
	};
	const provider = new AnchorProvider(connection, dummyWallet as any, {
		commitment: "confirmed",
	});
	return new Program(idl as Idl, provider);
}
