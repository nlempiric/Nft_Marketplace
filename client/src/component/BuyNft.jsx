import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, Navigate,useParams } from "react-router-dom";
import Loader from "react-js-loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { utils } = require('ethers');



const BuyNft = ({ ncontract, client }) => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [tokenIds, settokenIds] = useState([]);
  const [tid, setTid] = useState();
  const [imageChanged, setimageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { tokenId } = useParams(); 

  const [Data, setData] = useState({
    price: null,
    name: null,
    description: null,
    _imgUrl: null,
  });


  const getData = async () => {
    try {
      const data = await ncontract.getData(tokenId);
      console.log("dataaaaa", data);
      setData({
        name: data[2],
        // price:(data[3]._hex),
        price: Number(data[3]._hex),
        description: data[4],
        _imgUrl: data[5],
      });
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
    getData();
  }, [tid]);


  const handleBuy=async()=>
  {
    try
    {
      setIsLoading(true)
      console.log("dataaa",Data)
        const data = await ncontract.buyNft(tokenId,{value:Data.price});
        const d = await data.wait();
        console.log("dataaaaa",data)
        console.log("d event",d);
        toast.success("Success")

    }
    catch(err)
    {
        console.log("errorrrr",err)
        toast.error("Failed")
    }
    finally
    {
      setIsLoading(false);
    }
  }

console.log("Dataaaaaaaaaaaa",Data)

  return (
    <>
      <div className="flex flex-col justify-center items-center my-14 gap-6 mx-80">
        {
          isConnected ? ( 
            <>
            {isLoading ? (
            <div className="flex justify-center align-middle my-60 items-center">
            <Loader loaded={!isLoading} type="spinner-circle" bgColor={"#FFFFFF"} color={'#FFFFFF'}>
                Loading...
            </Loader>
            </div>
            ) : (
                <>
                <div className="text-center my-7 mx-auto font-sans">
                  <span
                    className="text-4xl text-gray-400 font-bold relative"
                    style={{ textShadow: "-1px 0 0 rgba(0, 0, 0, .2)" }}
                  >
                    Buy NFT
                    <span
                      className="absolute top-[0.30vmin] left-[-1px] transform-origin-left text-[#1c346d] transition-transform transform-rotate-y-25"
                      style={{
                        transition:
                          "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transform: "rotateY(2deg)",
                      }}
                    >
                      Buy NFT
                    </span>
                  </span>
                </div>
               
                <div className="flex justify-around w-full my-6">
                    <div className="w-full flex flex-col gap-2 justify-center items-center">
                    <div className="w-[260px] h-[350px]">
                        <img
                        src={Data._imgUrl}
                        className="w-full h-[100%] object-cover"
                        alt=""
                        />
                    </div>
                    
                    </div>
                    <div className="flex flex-col gap-6 w-full">
                    <div className="border border-1 border-gray-600 p-2 rounded-md " name="name">{Data.name}</div>
                    <div className="border border-1 border-gray-600 p-2 rounded-md " name="name">{Data.price}</div>
                    <div className="border border-1 border-gray-600 p-2 rounded-md " name="name">{Data.description}</div>
                    <br />
                   
                    <button
                        className="bg-blue-500 border border-blue-500 p-3 px-4 rounded-xl text-white hover:bg-transparent hover:text-blue-500" onClick={handleBuy}>
                        Buy Nft
                    </button>
                    </div>
                </div>
                  </>
            
            )}
            
            </>
          ) : (
            navigate("/")
          )
        }
      </div>
    </>
  );
};

export default BuyNft;
