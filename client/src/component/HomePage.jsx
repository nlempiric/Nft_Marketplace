import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Loader from "react-js-loader";
import { LinearGradient } from 'react-text-gradients'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ethers } from "ethers";



const HomePage = ({ ncontract, allAccounts}) => {
  const { address, isConnected } = useAccount();
  const [IDs, setIds] = useState([]);
  const [Df, setdf] = useState(false);
  const [Data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [buyorSaled, setbuyorSaled] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const navigate = useNavigate();


  const handleDivClick = (tokenId) => {
    navigate(`/buynft/${tokenId}`);
  };

  const handlesell=async(tokenId)=>
  {
    try
    {
      setIsLoading1(true)
      const tokenidNumber=Number(tokenId._hex)
      console.log("token Id",tokenidNumber)
      const removesell = await ncontract.removeSell(address,tokenidNumber);
      const d=await removesell.wait();
      console.log("removesell data",removesell)
      console.log("remove sell event",d)
      setIsLoading1(false)
      toast.success("Nft Is Removed From Sell")
    }
    catch(err)
    {
      console.log("errorrrr",err)
      toast.error("Failed")
    }
    finally
    {
      setIsLoading1(false);
    }
  }

  useEffect(() => {
   
    // const getData=async()=>
    // {
    //   try
    //   {
    //     const DataArray = [];
    //     for (let i = 0; i < allAccounts.length; i++) 
    //     {
    //       // console.log("iiii", allAccounts[i]);
    //       const tokenarray = await ncontract.getsellingTokenIdsByAddress(allAccounts[i]);
    //       // const TokenArrayNumber=Number(tokenarray._hex)
    //       // console.log("getsellingTokenIdsByAddress",tokenarray)
    //       for (let j = 0; j < tokenarray.length; j++) {
    //         const tokenIdNumber=Number(tokenarray[j]._hex)
    //         // console.log("tokneeeeeeeeeeeeeee",tokenIdNumber)
    //         const data = await ncontract.getData(tokenIdNumber);
    //         DataArray.push(data);
              
    //       }
    //       setIsLoading(false);
    //     }
    //     // console.log("newData ....", DataArray)
    //     setData( [ ...DataArray]);
    //   }
    //   catch(err)
    //   {
    //     console.log("errorrrrr",err)
    //   }
    //   finally
    //   {
    //     setIsLoading(false);
    //   }
    // }
    // getData();

    const getData=async()=>
    {
      try{
        const DataArray = [];
        const totalsupply=await ncontract.totalSupply();
        // console.log(Number(totalsupply._hex));
        const totalsupplyinNumber=Number(totalsupply._hex);
        for(let i=0 ;i<totalsupplyinNumber;i++)
        {
          const tokenIds=await ncontract.tokenByIndex(i);
          const tokenidNumber=Number(tokenIds._hex);
          console.log("token id number",tokenidNumber);
          const nftListed = await ncontract.isNftListed(tokenidNumber);
          console.log("isnftListed",nftListed)
          if(nftListed)
          {
            const data = await ncontract.getData(tokenidNumber);
            console.log("Data+++++++++++",data);
            DataArray.push(data);
          }

        }
        setIsLoading(false);
        setData( [ ...DataArray]);
      }
      catch(err)
      {
        console.log(err)
      }
      finally
      {
        setIsLoading(false);
      }
    }
    getData();
  }, [address,buyorSaled]); 


  return (
    <>
      {/* <div className="container mx-auto flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full py-14"> */}
      <div className={`container mx-auto flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full py-14 ${isLoading1 ? "opacity-40" : ""}`}>    
        <div className="flex my-11 gap-6">
          <div className="w-full flex flex-col items-center justify-center gap-4">
              <h1 className="text-5xl font-bold font-serif pr-2"> Start building your  
              <span className="px-3">
              <LinearGradient gradient={['to left', '#4a90f0 ,#0b5c1f']}>
              digital art
              </LinearGradient>
               </span> 
              collection</h1>
              <p className="">Discover 100+ digital artwork  and collect all of them in our platform </p>
          </div>
          <div className="w-full flex items-center justify-end">
            <img src={process.env.PUBLIC_URL + '/bghome.gif'} alt="" className="w-[550px]"/>
          </div>
        </div>
        {isConnected ? (
          isLoading ? (
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
            <div className="flex flex-col w-full pt-24">
              <div className="flex justify-center bg-[#1b245a] text-3xl py-2 rounded-xl w-full">NFT</div>
              <div className="flex flex-wrap gap-6 items-start py-20">
                {Data
                  ?
                  (Data.map((items, index) => {
                      const add=items[0];
                      // console.log("++++++++++++++++",add)
                      const tokenId=items[1]; 
                      const name = items[2];
                      const price1 = Number(items[3]._hex);
                      const price=ethers.utils.formatEther(price1)
                      const desc = items[4];
                      const i = items[5];
                      
                      
                      return (
                        <>
                          <div
                            key={index}
                            className="w-[250px] h-[370px] bg-[#0b1138] rounded overflow-hidden shadow-lg my-4 "
                          >
                            <img
                              className="w-full h-[60%] object-cover"
                              src={i}
                              alt="Sunset in the mountains"
                            />
                            <div className="flex flex-col gap-2 px-6 py-2">
                              <div className="flex items-center justify-between">
                                <div className="font-bold text-xl flex items-center ">
                                  {name}
                                </div>
                                
                              </div>
                                <div className="font-semibold">
                                  {price}Eth
                                </div>
                                  
                              <p className="text-sm text-gray-300">{desc}</p>
                                {add==address ? 
                                      <button className="border border-1 border-gray-600 px-3 py-1 rounded-full hover:bg-gray-600" onClick={() => handlesell(tokenId)}>
                                      Remove Sell
                                      </button>
                                    : 
                                      <button className="border border-1 border-gray-600 px-3 py-1 rounded-full hover:bg-gray-600" onClick={() => handleDivClick(tokenId)}>
                                      Buy
                                    </button>
                                  }

                            </div>
                          </div>
                        </>
                      );
                    }))
                  : ""}
              </div>
            </div>
          )
        ) : (
          ""
        )}
      </div>
      {isLoading1 ?
        <div className="absolute top-[750px] mx-[45%]">
          <Loader loaded={isLoading1} type="spinner-cub" bgColor={"#FFFFFF"} color={'#FFFFFF'}>
            Loading...
          </Loader>
        </div> 
        
        : ""}
    </>
  );
};

export default HomePage;
