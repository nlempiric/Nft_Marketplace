import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import Loader from "react-js-loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transfer = ({ ncontract, allAccounts, accounts }) => {
  const { address, isConnected } = useAccount();
  const [Data, setData] = useState({ toAdd: null, tokenId: null });
  const [Dataobject, setDataobject] = useState({
    price: null,
    name: null,
    description: null,
    img: null,
  });
  const navigate = useNavigate();
  const [tokenId, settokenId] = useState("");
  const [tIds, settIds] = useState([]);
  const [bal, setbal] = useState();
  const [transferd, settransfered] = useState(false);
  const [state, setState] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("all accountsssss",allAccounts)
  // console.log("filter addresssss",state)

  useEffect(() => {
    if (!address) {
      console.log("error in address");
    } else {
      const cleanAddress = (address) =>
        address ? address.trim().toLowerCase() : "";

      const cleanAccounts = allAccounts.map(cleanAddress);
      const cleanTargetAddress = cleanAddress(address);

      const filteredAddresses = cleanAccounts.filter(
        (cleanedAddress) => cleanedAddress !== cleanTargetAddress
      );
      setState(filteredAddresses);
    }
    const getIds = async () => {
      try {
        const balance = await ncontract.balanceOf(address);
        const balancinNumber = Number(balance._hex);
        setbal(balancinNumber);

        const newDataArray = [];

        for (let i = 0; i < balancinNumber; i++) {
          const tokenid = await ncontract.tokenOfOwnerByIndex(address, i);
          const tokenidNumber = Number(tokenid._hex);
          newDataArray.push(tokenidNumber);
        }

        settIds(newDataArray);
      } catch (error) {
        console.log(error);
      }
    };
    getIds();
  }, [address, transferd]);

  const changeHandler = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // console.log("address",address)
    const dataget = async () => {
      if (Data.tokenId != null) {
        try {
          const data = await ncontract.getData(Data.tokenId);
          console.log("Dataaaaa- transfer", data.tokenUri);
          const newDataObject = {
            name: data.name,
            price: Number(data.price._hex),
            description: data.desc,
            img: data.tokenUri,
          };
          setDataobject(newDataObject);
        } catch (err) {
          console.log("errorrrr", err);
        }
      }
    };
    dataget();
  }, [Data.tokenId]);

  // console.log("dataobject",Dataobject)
  const handleTransfer = async () => {
    console.log("Transfer Data----", Data);

    if (Data.tokenId != null && Data.toAdd != null) {
      try {
        setIsLoading(true);

        const transfer = await ncontract.transferFrom(
          address,
          Data.toAdd,
          Data.tokenId
        );
        const transferwait = await transfer.wait();
        settransfered(true);
        console.log("transferedd");
        toast.success("Nft Transfered");
      } catch (err) {
        console.log("errorrr", err);
        toast.error("Error in transferring");
      } finally {
        setIsLoading(false);
      }
    } else {
      // alert("Enter The Data");
      toast.warning("Please Enter the data");
    }
  };

  const handleBalance = async () => {
    console.log("balance of++", bal);
    toast.success(bal);
  };

  return (
    <>
      {/* <div className="container mx-auto  flex flex-col my-4"> */}
      <div className="container mx-auto flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full">
        {isConnected ? (
          <>
            {isLoading ? (
              <div className="flex justify-center align-middle my-60 items-center ">
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
                <div className="text-center my-7 mx-auto font-sans">
                  <span
                    className="text-4xl text-gray-400 font-bold relative"
                    style={{ textShadow: "-1px 0 0 rgba(0, 0, 0, .2)" }}
                  >
                    Transfer NFT
                    <span
                      className="absolute top-[0.30vmin] left-[-1px] transform-origin-left text-[#1c346d] transition-transform transform-rotate-y-25"
                      style={{
                        transition:
                          "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transform: "rotateY(2deg)",
                      }}
                    >
                      Transfer NFT
                    </span>
                  </span>
                </div>
                <div className="flex justify-around w-full my-20 2xl:flex-row xl:flex-row lg:flex-row md:flex-col sm:flex-col md:gap-8 sm:gap-8">
                  <div className="w-[250px] h-[350px] flex justify-center items-center border border-1 border-gray-700">
                    {Data.tokenId ? (
                      <>
                        <div className="w-[250px] h-[350px] bg-[#0b1138] rounded overflow-hidden shadow-lg my-4 hover:opacity-70">
                          <img
                            className="w-full h-[70%] object-cover"
                            src={Dataobject.img}
                            alt="Sunset in the mountains"
                          />
                          <div className="px-6 py-2">
                            <div className="font-bold text-xl mb-2">
                              {Dataobject.name}
                            </div>
                            <div className="font-semibold text-base mb-2">
                              {Dataobject.price}Eth
                            </div>
                            <p className="text-sm text-gray-300">
                              {Dataobject.description}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p>No Data</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-6">
                    <select
                      id="toAdd"
                      name="toAdd"
                      onChange={changeHandler}
                      value={Data.toAdd}
                      className="border border-1 border-gray-600 p-3 rounded-md bg-transparent w-full"
                    >
                      <option value="">Select Address</option>
                      {state &&
                        state?.map((add, index) => (
                          <option key={index} value={add}>
                            {add}
                          </option>
                        ))}
                    </select>
                    <select
                      id="tokenId"
                      name="tokenId"
                      onChange={changeHandler}
                      value={Data.tokenId}
                      className="border border-1 border-gray-600 p-3 rounded-md bg-transparent w-full"
                    >
                      <option value="">Select a Token ID</option>
                      {tIds?.map((tokenId, index) => (
                        <option key={index} value={tokenId}>
                          {tokenId}
                        </option>
                      ))}
                    </select>

                    <button
                      className="bg-blue-500  border border-blue-500 p-3 px-4 rounded-xl text-white hover:bg-transparent hover:text-blue-500"
                      onClick={handleTransfer}
                    >
                      Transfer NFT
                    </button>
                    <button
                      className="bg-blue-500  border border-blue-500 p-3 px-4 rounded-xl text-white hover:bg-transparent hover:text-blue-500"
                      onClick={handleBalance}
                    >
                      Check Balance
                    </button>
                  </div>
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

export default Transfer;
