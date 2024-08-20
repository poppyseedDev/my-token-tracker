import { ethers } from 'ethers';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import * as tokenList from './tokens.json';

interface TokenBalance {
  symbol: string;
  balance: string;
  chain: string;
}

const networks = [mainnet, polygon, optimism, arbitrum];

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
      chain.id,
      ALCHEMY_API_KEY
    );

    for (const token of tokenList.tokens) {
      // Only process tokens that are on the current chain
      if (token.chainId === chain.id) {
        const contract = new ethers.Contract(token.address, tokenContractABI, provider);
        try {
          const balance = await contract.balanceOf(address);
          const symbol = await contract.symbol();

          if (balance === 0) {
            continue;
          }
          balances.push({
            symbol,
            balance: ethers.formatUnits(balance, token.decimals),
            chain: chain.name,
          });
          console.log(`Fetched ${symbol} balance from ${chain.name}:`, balance.toString());
        } catch (error) {
          console.error(`Error fetching data from ${chain.name} for token ${token.address}:`, error);
        }
      }
    }
  }

  return balances;
}
