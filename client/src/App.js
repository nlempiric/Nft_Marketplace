import Mint from "./component/Mint";
import React, { useState, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import {EthereumClient,w3mConnectors,w3mProvider,} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Web3Button } from "@web3modal/react";
import { useAccount, useDisconnect } from "wagmi";
import Header from "./component/Header";
import HomePage from "./component/HomePage";
import Transfer from "./component/Transfer";
import { ethers } from "ethers";
import abi from "./NFT.json";
import Update from "./component/Update";
import { NFTStorage, File, Blob } from "nft.storage";
import { ToastContainer } from 'react-toastify';
import ShowNft from "./component/ShowNft";
import BuyNft from "./component/BuyNft";


// const chains1 = [mainnet];
// const projectId = "efc7f3f2e52f6d9fcceaaeeee2283265";
// const { publicClient } = configureChains(chains1, [w3mProvider({ projectId })]);

// const wagmiConfig = createConfig({autoConnect: true,connectors: w3mConnectors({ projectId, chains1 }),publicClient,});
// const ethereumClient = new EthereumClient(wagmiConfig, chains1);
// const providers = new ethers.providers.Web3Provider(window.ethereum);
// const signer = providers.getSigner();
// const contractAddress = "0x32D27D81d911Ca8561724641402eFb1d24E03b8d";
// const contractAbi = abi.abi;
// const ncontract = new ethers.Contract(contractAddress, contractAbi, signer);

function App({ncontract,providers}) {

  const { address, isConnected } = useAccount();
  const [allAccounts, setallAccounts] = useState([]);
  const [accounts, setaccounts] = useState([]);
  const [walletConnected, setwalletConnected] = useState(false);
  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDgzNDc0ODYwOTY2ZmQ3NzFGQ0ExNThhNmU2M0M5Y0UyNjgxOUREOUEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY5NjI0NTQ3MTM5MywibmFtZSI6Ik5GVFNUT1JBR0UifQ.8hg1Lem_QnZ-rtXN3gZHPc_RAyAQq0iyOojHssowpu4";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  const handleConnect = async () => {
    try {
      // if (window.ethereum) {
      //     const accounts = await window.ethereum.request({
      //     method: "eth_requestAccounts",
      //   });
      //   setallAccounts(accounts);
      //   const cleanAddress = (address) =>
      //   address ? address.trim().toLowerCase() : "";

      //   const cleanAccounts =await accounts.map(cleanAddress);
      //   const cleanTargetAddress = cleanAddress(address);

      //   const filteredAddresses = cleanAccounts.filter(
      //     (cleanedAddress) => cleanedAddress !== cleanTargetAddress
      //   );
      //  // console.log("filter addresss",filteredAddresses)
      //   setaccounts(filteredAddresses);
      // }
      providers.listAccounts()
      .then(accounts => {
        console.log("MetaMask accounts:", accounts);
        setallAccounts(accounts);
    
  })
  .catch(error => {
    console.error("Error fetching MetaMask accounts:", error);
  });
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };



  useEffect(() => {
    handleConnect();
  }, []);

  //console.log("address app ",address)
  //console.log("accounts appp",accounts)

  return (
    <BrowserRouter>
      <div className="App min-h-screen top-0">
        {/* <WagmiConfig config={wagmiConfig}> */}
          <Header />
          <ToastContainer/>
          <Routes>
            {/* <Route path='/' element={ <Navigate to="/" /> }/> */}
            <Route path="/" element={<HomePage ncontract={ncontract} accounts={accounts} allAccounts={allAccounts}/>} />
            <Route
              path="/mint"
              element={<Mint ncontract={ncontract} client={client}/>}
              
            />
            <Route
              path="/buynft/:tokenId"
              element={<BuyNft ncontract={ncontract} client={client}/>}
              
            />
            <Route
              path="/transfer"
              element={
                <Transfer ncontract={ncontract} allAccounts={allAccounts} />
              }
            />
            <Route
              path="/update"
              element={<Update ncontract={ncontract} client={client} />}
            />
            <Route
              path="/mynft"
              element={<ShowNft ncontract={ncontract}/>}
            />
          </Routes>

          {/* <Web3Modal projectId={projectId} ethereumClient={ethereumClient} /> */}
        {/* </WagmiConfig> */}
      </div>
    </BrowserRouter>
  );
}

export default App;
