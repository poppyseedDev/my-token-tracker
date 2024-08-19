'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
import { getERC20Tokens } from '@/lib/tokens';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<{ symbol: string; balance: string; chain: string }[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokens();
    }
  }, [isConnected, address]);

  const fetchTokens = async () => {
    try {
      if (address) {
        const tokenData = await getERC20Tokens(address);
        setTokens(tokenData);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Multi-Chain Token Tracker</h1>

      {!isConnected ? (
        <ConnectButton />
      ) : (
        <div className="w-full max-w-md">
          <button
            onClick={fetchTokens}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Get Tokens
          </button>
        </div>
      )}

      {tokens.length > 0 && (
        <ul className="w-full max-w-md mt-6 bg-white shadow-md rounded-lg p-4">
          {tokens.map((token, index) => (
            <li
              key={index}
              className="flex justify-between p-2 border-b last:border-none border-gray-200"
            >
              <span className="font-medium text-gray-700">
                {token.symbol} on {token.chain}:
              </span>
              <span className="font-bold text-gray-900">{token.balance}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
