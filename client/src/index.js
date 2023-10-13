import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { ethers } from "ethers";
import abi from "./NFT.json";
import { mainnet } from "wagmi/chains";
import {EthereumClient,w3mConnectors,w3mProvider,} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";



const root = ReactDOM.createRoot(document.getElementById('root'));

const chains1 = [mainnet];
const projectId = "efc7f3f2e52f6d9fcceaaeeee2283265";
const { publicClient } = configureChains(chains1, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({autoConnect: true,connectors: w3mConnectors({ projectId, chains1 }),publicClient,});
const ethereumClient = new EthereumClient(wagmiConfig, chains1);
const providers = new ethers.providers.Web3Provider(window.ethereum);
const signer = providers.getSigner();
const contractAddress = "0x4b62F6DbA6b81bcD9CbbB4E16Df6D4Be90F1843f";
const contractAbi = abi.abi;
const ncontract = new ethers.Contract(contractAddress, contractAbi, signer);

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <App ncontract={ncontract} providers={providers}/>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />

    </WagmiConfig>
  
  </React.StrictMode>
);

reportWebVitals();
