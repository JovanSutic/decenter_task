import {Web3, Contract} from "web3";
import { CDP_ABI, RATE_ABI, cdpManagerAddress, ilkRateAddress } from "../utils/constants";

class Web3Singleton {
  private static web3Instance: Web3 | null = null;
  private static cdpManager: Contract<typeof CDP_ABI> | null = null;
  private static rateManager: Contract<typeof RATE_ABI> | null = null;

  private static initializeWeb3(): void {
    if (!this.web3Instance) {
      const provider = window.ethereum || `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
      this.web3Instance = new Web3(provider);
    }
  }

  public static getInstance(): Web3 {
    if (!this.web3Instance) {
      this.initializeWeb3();
    }

    return this.web3Instance!;
  }

  
  public static getCdpManager(): Contract<typeof CDP_ABI> | null {
    if (!this.web3Instance) {
      this.getInstance();
    }

    if (!this.cdpManager) {
      this.cdpManager = new this.web3Instance!.eth.Contract(CDP_ABI, cdpManagerAddress);
    }

    return this.cdpManager;
  }

  public static getRateManager(): Contract<typeof RATE_ABI> | null {
    if (!this.web3Instance) {
      this.getInstance();
    }

    if (!this.rateManager) {
      this.rateManager = new this.web3Instance!.eth.Contract(RATE_ABI, ilkRateAddress)
    }

    return this.rateManager;
  }
}

export default Web3Singleton;
