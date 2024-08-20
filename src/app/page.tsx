'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect, useCallback } from 'react';
import { getERC20Tokens } from '@/lib/tokens';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tokens, setTokens] = useState<{ symbol: string; balance: string; chain: string; logoURI?: string }[]>([]);

  const fetchTokens = useCallback(async () => {
    try {
      if (address) {
        const tokenData = await getERC20Tokens(address);
        // Filter only tokens with a positive balance
        const positiveBalances = tokenData.filter(token => parseFloat(token.balance) > 0);
        setTokens(positiveBalances);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchTokens();
    }
  }, [isConnected, address, fetchTokens]);

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

      {tokens.length > 0 ? (
        <ul className="w-full max-w-md mt-6 bg-white shadow-md rounded-lg p-4">
          {tokens.map((token, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-4 border-b last:border-none border-gray-200"
            >
              <div className="flex items-center">
                {token.logoURI && (
                  <img src={token.logoURI} alt={token.symbol} className="w-10 h-10 mr-4" />
                )}
                <div>
                  <span className="block font-medium text-gray-700">
                    {token.symbol} on {token.chain}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {parseFloat(token.balance).toLocaleString()} {token.symbol}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 mt-6">No tokens with positive balances found.</p>
      )}
    </div>
  );
}
