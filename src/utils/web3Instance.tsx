// Somewhere in your app initialization or effect
import Web3 from 'web3';
import { State } from '../types/store.types';
import { store } from '../hooks/store';

export const initWeb3 = () => {
  if (typeof window.ethereum !== "undefined") {
    try {
      const web3Instance = new Web3(window.ethereum);
      store.setState('web3', (state: State) => ({ ...state, web3: web3Instance }));
    } catch (error) {
      console.error("User denied account access", error);
    }
  } else {
    const infuraUrl = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`;
    store.setState('web3', (state: State) => ({ ...state, web3: new Web3(new Web3.providers.HttpProvider(infuraUrl)) }));
  }
};