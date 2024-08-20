import { ethers } from 'ethers';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import * as tokenListUN from './tokens.json';
import { Provider } from 'ethers';
import { TokenList } from './types';

const tokenList: TokenList = tokenListUN;

interface TokenBalance {
  symbol: string;
  balance: string;
  chain: string;
  logoURI?: string;
}

const networks = [mainnet, polygon, optimism];

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
      // Process tokens on the current chain
      if (token.chainId === chain.id) {
        await fetchTokenBalance(provider, address, token, chain, balances);
      }

      // Process tokens on additional chains listed in extensions.bridgeInfo
      if (token.extensions?.bridgeInfo) {
        for (const [bridgeChainId, bridgeData] of Object.entries(token.extensions.bridgeInfo)) {
          if (parseInt(bridgeChainId) === chain.id) {
            const bridgedToken = {
              ...token,
              address: bridgeData.tokenAddress,
              chainId: parseInt(bridgeChainId),
            };
            await fetchTokenBalance(provider, address, bridgedToken, chain, balances);
          }
        }
      }
    }
  }

  return balances;
}

async function fetchTokenBalance(
  provider: Provider,
  address: string,
  token: any,
  chain: any,
  balances: TokenBalance[]
) {
  const contract = new ethers.Contract(token.address, tokenContractABI, provider);
  try {
    const balance = await contract.balanceOf(address);
    const symbol = await contract.symbol();

    balances.push({
      symbol,
      balance: ethers.formatUnits(balance, token.decimals),
      chain: chain.name,
      logoURI: token.logoURI,
    });
    console.log(`Fetched ${symbol} balance from ${chain.name}:`, balance.toString());
  } catch (error) {
    console.error(`Error fetching data from ${chain.name} for token ${token.address}:`, error);
  }
}
