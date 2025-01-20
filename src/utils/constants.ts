import { CollateralInfo } from "../types/cdp.types";
import { IlkType } from "../types/store.types";

export const cdpManagerAddress = "0x68C61AF097b834c68eA6EA5e46aF6c04E8945B2d";
export const ilkRateAddress = "0x35d1b3f3d7966a1dfe207aa4514c12a259a0492b";

export const RATE_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "ilk",
        type: "bytes32",
      },
    ],
    name: "ilks",
    outputs: [
      {
        name: "Art",
        type: "uint256",
      },
      {
        name: "rate",
        type: "uint256",
      },
      {
        name: "spot",
        type: "uint256",
      },
      {
        name: "line",
        type: "uint256",
      },
      {
        name: "dust",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

export const CDP_ABI = [
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "_getProxyOwner",
    outputs: [{ internalType: "address", name: "userAddr", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_cdpId", type: "uint256" }],
    name: "getCdpInfo",
    outputs: [
      { internalType: "address", name: "urn", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "userAddr", type: "address" },
      { internalType: "bytes32", name: "ilk", type: "bytes32" },
      { internalType: "uint256", name: "collateral", type: "uint256" },
      { internalType: "uint256", name: "debt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const ilkRateMap: Record<IlkType, string> = {
  "ETH-A": "ethRate",
  "WBTC-A": "wbtcRate",
  "USDC-A": "usdcRate",
};

export const collateralDetails: Record<IlkType, CollateralInfo> = {
  "ETH-A": { price: 3340, liquidationRatio: 1.45 },
  "WBTC-A": { price: 107885, liquidationRatio: 1.45 },
  "USDC-A": { price: 1, liquidationRatio: 1.05 }
};