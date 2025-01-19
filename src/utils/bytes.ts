import { Buffer } from "buffer";

// Ensure Buffer is defined in the global scope if needed
if (typeof window !== "undefined" && typeof window.Buffer === "undefined") {
  window.Buffer = Buffer;
}

export function bytesToString(hex: string): string {
  return Buffer.from(hex.replace(/^0x/, ""), "hex")
    .toString()
    .replace(/\x00/g, "");
}

/**
 * @param str {string}
 * @return {string} input encoded to hex, padded to 32 bytes
 */
export function stringToBytes(str: string): string {
  let n = Buffer.from(str).toString("hex");
  while (n.length < 64) n = `${n}0`;
  return `0x${n}`;
}

export function formatTo4Decimals(num: number): number {
    return Number(num.toFixed(4));
}

export function bigIntToNum(num: bigint, assetType: string): number {
  return formatTo4Decimals(Number(num) / 1e18);
}


