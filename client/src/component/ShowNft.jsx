import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Loader from "react-js-loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ethers } from "ethers";

const ShowNft = ({ ncontract }) => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  // const [Data, setData] = useState({
  //     price: null,
  //     name: null,
  //     description: null,
  //     _imgUrl: null,
  //     MetaDataURi: null,
  //   });
  const [getData, setgetData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoading1, setIsLoading1] = useState(false);
  const [buyorSaled, setbuyorSaled] = useState(false);
  const [buyorSaled1, setbuyorSaled1] = useState(false);
 

  const handleSell = async (tokenId) => {
    try {
      setIsLoading1(true);
      const tokenidNumber = Number(tokenId._hex);
      console.log("token Id", tokenidNumber);
      const sellData = await ncontract.selldata(tokenidNumber);
      const d = await sellData.wait();
      setbuyorSaled1(true);
      setIsLoading1(false);
      toast.success("selled NFT");
    } catch (error) {
      console.log("error", error.reason);
      toast.error(error.reason);
    } finally {
      setIsLoading1(false);
    }
  };


  const handleremoveSell = async (tokenId) => {
    try {
      setIsLoading1(true);
      const tokenidNumber = Number(tokenId._hex);
      console.log("token Id", tokenidNumber);
      const removesell = await ncontract.removeSell(address, tokenidNumber);
      const d = await removesell.wait();
      console.log("removesell data", removesell);
      console.log("remove sell event", d);
      setbuyorSaled(true);
      setIsLoading1(false);
      toast.success("Nft Is Removed From Sell");
    } catch (err) {
      console.log("errorrrr", err);
      toast.error("Failed");
    } finally {
      setIsLoading1(false);
    }
  };

  useEffect(() => {
    const handleshowNft1 = async () => {
      try {
        const balance = await ncontract.balanceOf(address);
        const balancinNumber = Number(balance._hex);

        const newDataArray = [];

        for (let i = 0; i < balancinNumber; i++) {
          const tokenid = await ncontract.tokenOfOwnerByIndex(address, i);
          const tokenidNumber = Number(tokenid._hex);
          const data = await ncontract.getData(tokenidNumber);
          const isListed = await ncontract.isNftListed(tokenidNumber);
          // console.log("isNftListed", isListed);
          newDataArray.push({ isListed, data });
          // newDataArray.push(data);
          // console.log("++++++++++++++++++++", newDataArray);
        }

        setgetData(newDataArray);
        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
  // console.log("calling..")
    handleshowNft1();
  }, [address, buyorSaled, buyorSaled1]);

  return (
    <>
      <div
        className={`container mx-auto py-14 flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full ${
          isLoading1 ? "opacity-40" : ""
        }`}
      >
        {isConnected ? (
          <>
            <div className=" flex justify-center bg-[#0b1138] text-3xl py-2 rounded-xl w-full">
              <h1>NFTS</h1>
            </div>
            {isLoading ? (
              <div className="flex justify-center align-middle my-60 items-center">
                <Loader
                  loaded={!isLoading}
                  type="spinner-circle"
                  bgColor={"#FFFFFF"}
                  color={"#FFFFFF"}
                >
                  Loading...
                </Loader>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap my-12 w-full justify-start gap-6">
                  {getData ? (
                    getData.map((items) => {
                      const tokenId = items.data[1];
                      const nftSelled = items.isListed;
                      const name = items.data[2];
                      const price1 = Number(items.data[3]._hex);
                      const price = ethers.utils.formatEther(price1);
                      const desc = items.data[4];
                      const i = items.data[5];

                      return (
                        <>
                          <div
                            key={tokenId}
                            className="w-[250px] h-[370px] bg-[#0b1138] rounded overflow-hidden shadow-lg my-4 hover:opacity-70"
                          >
                            <img
                              className="w-full h-[60%] object-cover"
                              src={i}
                              alt="Sunset in the mountains"
                            />
                            <div className=" flex flex-col gap-2 px-6 py-2">
                              {/* <div className="font-bold text-xl mb-2">{name}</div> */}
                              <div className="font-bold text-xl  flex items-center">
                                {name}
                              </div>
                              <div className="font-semibold text-base ">
                                {price}Eth
                              </div>
                              <p className="text-sm text-gray-300">{desc}</p>
                              {nftSelled ? (
                                <button
                                  className="border border-1 border-gray-600 px-3 py-1 rounded-full hover:bg-gray-600"
                                  onClick={() => handleremoveSell(tokenId)}
                                >
                                  Remove Sell
                                </button>
                              ) : (
                                <button
                                  className="border border-1 border-gray-600 px-3 py-1 rounded-full hover:bg-gray-600"
                                  onClick={() => handleSell(tokenId)}
                                >
                                  Sell
                                </button>
                              )}
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
      {isLoading1 ? (
        <div className="absolute top-[350px] mx-[50%]">
          <Loader
            loaded={isLoading1}
            type="spinner-cub"
            bgColor={"#FFFFFF"}
            color={"#FFFFFF"}
          >
            Loading...
          </Loader>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ShowNft;
