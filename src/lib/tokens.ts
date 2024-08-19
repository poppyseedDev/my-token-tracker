// lib/tokens.ts
import { ethers } from 'ethers';
import * as tokens from './tokens.json';

interface TokenBalance {
  symbol: string;
  balance: string;
  chain: string;
}

const networks = [
  'mainnet'
];

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

if (!ALCHEMY_API_KEY) {
  throw new Error('Missing Alchemy API key in environment variables');
}

const tokenContractABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)"
];

export async function getERC20Tokens(address: string): Promise<TokenBalance[]> {
  const balances: TokenBalance[] = [];

  for (const chain of networks) {
    const provider = new ethers.AlchemyProvider(
      chain,
      ALCHEMY_API_KEY
    );

    for (const token of tokens.tokens) {
      const contract = new ethers.Contract(token.address, tokenContractABI, provider);
      try {
        const balance = await contract.balanceOf(address);
        const symbol = await contract.symbol();

        balances.push({
          symbol,
          balance: ethers.formatUnits(balance, token.decimals),
          chain,
        });
        console.log(`Fetched ${symbol} balance from ${chain}:`, balance.toString());
      } catch (error) {
        console.error(`Error fetching data from ${chain} for token ${token.address}:`, error);
      }
    }
  }

  return balances;
}
