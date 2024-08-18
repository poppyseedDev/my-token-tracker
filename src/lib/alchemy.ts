// lib/alchemy.ts
import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.alchemyapi.io/v2/YOUR_ALCHEMY_API_KEY`);

interface TokenBalance {
  symbol: string;
  balance: string;
}

export async function getERC20Tokens(address: string): Promise<TokenBalance[]> {
  const tokenContractABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function symbol() view returns (string)"
  ];

  const tokens = [
    { address: '0xTokenContractAddress1', chainId: 1 },
    { address: '0xTokenContractAddress2', chainId: 1 }
    // Add more tokens and chains as needed
  ];

  const balances: TokenBalance[] = [];

  for (let token of tokens) {
    const contract = new ethers.Contract(token.address, tokenContractABI, provider);
    const balance = await contract.balanceOf(address);
    const symbol = await contract.symbol();

    balances.push({
      symbol,
      balance: ethers.utils.formatUnits(balance, 18) // Assumes 18 decimals
    });
  }

  return balances;
}
