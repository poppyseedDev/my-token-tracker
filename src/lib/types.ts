interface BridgeInfo {
    [chainId: string]: {
      tokenAddress: string;
    };
  }

interface TokenExtensions {
    bridgeInfo?: BridgeInfo;
}

interface Token {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI?: string;
    extensions?: TokenExtensions;
}

interface Version {
    major: number;
    minor: number;
    patch: number;
}

export interface TokenList {
    name: string;
    timestamp: string;
    version: Version;
    logoURI: string;
    keywords: string[];
    tokens: Token[];
}
