import { router } from '@inertiajs/react';
import { ensureBotChain } from '@/lib/botChain.ts';
import { postJson } from '@/lib/http.ts';

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}

export function shortenAddress(address: string): string {
    if (address.length < 10) return address;
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export async function connectWalletAndLogin(redirectTo = '/chat'): Promise<string> {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please add a Web3 wallet to continue.');
    }

    const accounts = (await window.ethereum.request({
        method: 'eth_requestAccounts',
    })) as string[];

    const address = accounts[0];
    if (!address) {
        throw new Error('No wallet account selected.');
    }

    try {
        await ensureBotChain();
    } catch {
        // Wallet login still works if user switches network later for on-chain actions.
    }

    const response = await postJson('/auth/wallet', { wallet_address: address });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = typeof data.message === 'string'
            ? data.message
            : 'Could not sign in with this wallet.';
        throw new Error(message);
    }

    const data = await response.json();
    router.visit(redirectTo);

    return data.wallet_address as string;
}

export async function logoutWallet(): Promise<void> {
    const response = await postJson('/auth/logout', {});
    if (!response.ok) {
        throw new Error('Logout failed.');
    }
    router.visit('/');
}
