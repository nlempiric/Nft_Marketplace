import React, { useEffect, useState } from 'react'
import { useAccount, useDisconnect } from "wagmi";
import Loader from "react-js-loader";
import { useNavigate } from "react-router-dom";


const ShowNft = ({ncontract}) => {

    const { address, isConnected } = useAccount();
    const navigate = useNavigate();
    const [Data, setData] = useState({
        price: null,
        name: null,
        description: null,
        _imgUrl: null,
        MetaDataURi: null,
      });
      const [getData, setgetData] = useState([]);
      const [isLoading, setIsLoading] = useState(true);




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
              newDataArray.push(data);
            }
    
            setgetData(newDataArray);
            setIsLoading(false)
          } catch (error) {
            console.log("error", error);
          }
        };
    
        handleshowNft1();
      },  [ address]);
  return (
    <>
    
      <div className=" container mx-auto py-14 flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full">
        {isConnected ? (
            
          <>
          <div className=" flex justify-center bg-[#0b1138] text-3xl py-2 rounded-xl w-full">
            <h1>NFTS</h1>
            </div>
          {isLoading ? (
            <div className="flex justify-center align-middle my-60 items-center">
            <Loader loaded={!isLoading} type="spinner-circle" bgColor={"#FFFFFF"} color={'#FFFFFF'}>
              Loading...
            </Loader>
          </div>
          ) : (
            <>
           
            
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
  )
}

export default ShowNft
