import React, { useState, useEffect } from "react";
import { Web3Button } from "@web3modal/react";
import axios from "axios";
import { NFTStorage, File, Blob } from "nft.storage";
import { useAccount, useDisconnect } from "wagmi";
import { ethers } from "ethers";
import abi from "../NFT.json";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Mint = ({ ncontract, client }) => {

  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [allAccounts, setAllAccounts] = useState([]);
  const [getData, setgetData] = useState([]);
  const [minted, setMinted] = useState(false);
  const [Data, setData] = useState({
    price: null,
    name: null,
    description: null,
    _imgUrl: null,
    MetaDataURi: null,
  });
  const navigate = useNavigate();


  const handleMintNFT = async () => {
    console.log("adress",address)

    if (
      Data.name != "" &&
      Data.price > 0 &&
      Data.description != "" &&
      Data._imgUrl != ""
    )
    {
        try {
          setIsLoading(true); 
          const imageFile = new File([Data.imgUrl], "nft.png", {
          type: "image/png",
          });
          console.log("Dataaaa",Data)
          const metaData = await client.store({
            name: Data.name,
            price: Data.price,
            description: Data.description,
            image: imageFile
          });

          const imgurl1 = metaData.data.image.pathname;
          const i = imgurl1.replace("/nft.png", ".ipfs.dweb.link/nft.png");
          const url = i.replace("//", "https://");

          const cid = metaData.ipnft;

          const mintNft = await ncontract.mintTo(
            address,
            Data.name,
            Data.price,
            Data.description,
            url,
            cid
          );
          const d = await mintNft.wait();
          
          const tokenid = d.events[0].args.tokenId._hex;
          const tokenIdNumber = Number(tokenid);

          setMinted(true);
          toast.success("Minted successfully")

      } catch (err) {
        console.log(err);
        toast.error(err)
      }
      finally
      {
        setIsLoading(false);
      }
    }
    else{
      console.log("fill all the data")
      toast.warning('Please fill all the fields')
    }
   
   
  };

  const changeHandler = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleImangechange = (e) => {
    setData({
      ...Data,
      _imgUrl: URL.createObjectURL(e.target.files[0]),
      imgUrl: e.target.files[0],
    });
  };

  useEffect(() => {
    console.log("helloq world");
  }, [])
  
  // useEffect(() => {
  //   const handleshowNft1 = async () => {
  //     try {
  //       const balance = await ncontract.balanceOf(address);
  //       const balancinNumber = Number(balance._hex);

  //       const newDataArray = [];

  //       for (let i = 0; i < balancinNumber; i++) {
  //         const tokenid = await ncontract.tokenOfOwnerByIndex(address, i);
  //         const tokenidNumber = Number(tokenid._hex);
  //         const data = await ncontract.getData(tokenidNumber);
  //         newDataArray.push(data);
  //       }

  //       setgetData(newDataArray);
  //     } catch (error) {
  //       console.log("error", error);
  //     }
  //   };

  //   handleshowNft1();
  // }, [minted, address]);

  return (
    <>
    
      <div className=" container mx-auto flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full">
        {isConnected ? (
          <>
          {isLoading ? (
            <div className="flex justify-center align-middle my-60 items-center">
            <Loader loaded={!isLoading} type="spinner-circle" bgColor={"#FFFFFF"} color={'#FFFFFF'}>
              Loading...
            </Loader>
          </div>
          ) : (
            <>
            <div className="flex flex-col justify-center w-full">
              <div className="text-center my-7 mx-auto font-sans">
                <span
                  className="text-4xl text-gray-400 font-bold relative"
                  style={{ textShadow: "-1px 0 0 rgba(0, 0, 0, .2)" }}
                >
                  Mint NFT
                  <span
                    className="absolute top-[0.30vmin] left-[-1px] transform-origin-left text-[#1c346d] transition-transform transform-rotate-y-25"
                    style={{
                      transition:
                        "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      transform: "rotateY(2deg)",
                    }}
                  >
                    Mint NFT
                  </span>
                </span>
              </div>
              <div className="flex justify-around w-full my-14 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col md:gap-8 sm:gap-8">
                <div className="flex flex-col gap-2 justify-center items-center">
                  <div className="w-[260px] h-[350px] flex justify-center items-center border border-1 border-gray-700">
                    {Data._imgUrl ? (
                      <img
                        src={Data._imgUrl}
                        className="w-full h-[100%] object-cover"
                        alt=""
                      />
                    ) : (
                      <div className="">Upload Image</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    className="border border-1 border-gray-600 p-2 rounded-md "
                    name="name"
                    type="text"
                    placeholder="Name"
                    onChange={changeHandler}
                  />
                  <br />
                  <input
                    className="border border-1 border-gray-600 p-2 rounded-md"
                    name="price"
                    type="number"
                    placeholder="Price"
                    onChange={changeHandler}
                  />
                  <br />
                  <input
                    className="border border-1 border-gray-600 p-2 rounded-md"
                    name="description"
                    type="text"
                    placeholder="Description"
                    onChange={changeHandler}
                  />
                  <br />
                  <input
                    className="border border-1 border-gray-600 p-2 rounded-md text-white file:bg-transparent file:text-white file:border file:border-1 file:border-gray-400"
                    name="_imgUrl"
                    type="file"
                    onChange={handleImangechange}
                  />
                  <br />
                  <button
                    className="bg-blue-500 border border-blue-500 p-3 px-4 rounded-xl text-white hover:bg-transparent hover:text-blue-500"
                    onClick={handleMintNFT}
                  >
                    Mint NFT
                  </button>
                </div>
              </div>
            </div>

            <div className=" flex justify-center bg-[#0b1138] text-3xl py-2 rounded-xl w-full">
              <h1>NFTS</h1>
            </div>
            <div className="flex flex-wrap my-12 w-full justify-start gap-6">
              {getData ? (
                getData.map((items, index) => {
                  const name = items[0];
                  const price = Number(items[1]._hex);
                  const desc = items[2];
                  const i = items[3];

                  return (
                    <>
                      <div
                        key={index}
                        className="w-[250px] h-[350px] bg-[#0b1138] rounded overflow-hidden shadow-lg my-4 hover:opacity-70"
                      >
                        <img
                          className="w-full h-[70%] object-cover"
                          src={i}
                          alt="Sunset in the mountains"
                        />
                        <div className="px-6 py-2">
                          <div className="font-bold text-xl mb-2">{name}</div>
                          <div className="font-semibold text-base mb-2">
                            {price}Eth
                          </div>
                          <p className="text-sm text-gray-300">{desc}</p>
                        </div>
                      </div>
                    </>
                  );
                })
              ) : (
                <p>No NFTs</p>
              )}
            </div>
            </>
          )}
            
          </>
        ) : (
          navigate("/")
        )}
      </div>
    </>
  );
};

export default Mint;
