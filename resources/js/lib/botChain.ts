declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
        };
    }
}

function chainId(): number {
    return Number(import.meta.env.VITE_BOT_CHAIN_ID || 968);
}

function rpcUrl(): string {
    return import.meta.env.VITE_BOT_CHAIN_RPC || 'https://rpc.bohr.life';
}

export function getExplorerBaseUrl(): string {
    const id = chainId();
    return id === 677 ? 'https://scan.botchain.ai' : 'https://scan.bohr.life';
}

export function explorerTxUrl(txHash: string): string {
    return `${getExplorerBaseUrl()}/tx/${txHash}`;
}

export async function ensureBotChain(): Promise<void> {
    if (!window.ethereum) {
        throw new Error('MetaMask is required to interact with BOT Chain.');
    }

    const id = chainId();
    const hexChainId = `0x${id.toString(16)}`;
    const chainName = id === 677 ? 'BOT Chain Mainnet' : 'BOT Chain Testnet';

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hexChainId }],
        });
    } catch (error: unknown) {
        const err = error as { code?: number };
        if (err.code !== 4902) {
            throw error;
        }

        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: hexChainId,
                chainName,
                rpcUrls: [rpcUrl()],
                nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
                blockExplorerUrls: [getExplorerBaseUrl()],
            }],
        });
    }
}
