// pages/index.tsx
import { useState } from 'react';
import { getERC20Tokens } from '../lib/alchemy';

export default function Home() {
  const [address, setAddress] = useState<string>('');
  const [tokens, setTokens] = useState<{ symbol: string; balance: string }[]>([]);

  const fetchTokens = async () => {
    try {
      const tokenData = await getERC20Tokens(address);
      setTokens(tokenData);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  };

  return (
    <div>
      <h1>My Token Tracker</h1>
      <input
        type="text"
        placeholder="Enter your Ethereum address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={fetchTokens}>Get Tokens</button>

      {tokens.length > 0 && (
        <ul>
          {tokens.map((token, index) => (
            <li key={index}>
              {token.symbol}: {token.balance}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
