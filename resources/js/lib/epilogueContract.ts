import { BrowserProvider, Contract } from 'ethers';
import abi from '@contracts/abi/Epilogue.json';
import { ensureBotChain } from '@/lib/botChain.ts';

export async function getEpilogueContract(): Promise<Contract> {
    const address = import.meta.env.VITE_EPILOGUE_CONTRACT as string | undefined;
    if (!address) {
        throw new Error('VITE_EPILOGUE_CONTRACT is not set. Add your deployed contract address to .env');
    }

    await ensureBotChain();

    if (!window.ethereum) {
        throw new Error('MetaMask is required.');
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new Contract(address, abi, signer);
}

export async function logSafetyReportOnChain(
    reportHash: string,
    isAnonymous: boolean,
): Promise<string> {
    const contract = await getEpilogueContract();
    const tx = await contract.logSafetyReport(reportHash, isAnonymous);
    const receipt = await tx.wait();
    return receipt.hash as string;
}

export async function mintAdviceOnChain(category: string, contentHash: string): Promise<string> {
    const contract = await getEpilogueContract();
    const tx = await contract.mintAdvice(category, contentHash);
    const receipt = await tx.wait();
    return receipt.hash as string;
}
