import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import Loader from "react-js-loader";

const HomePage = ({ ncontract, accounts }) => {
  const { address, isConnected } = useAccount();
  const [IDs, setIds] = useState([]);
  const [Df, setdf] = useState(false);
  const [Data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // console.log("accontsssss", accounts);

  useEffect(() => {
    const getIds = async () => {
      try {
        const DataArray = [];
        for (let i = 0; i < accounts.length; i++) {
          console.log("iiii", accounts[i]);
          const balance = await ncontract.balanceOf(accounts[i]);
          const balancinNumber = Number(balance._hex);
          for (let j = 0; j < balancinNumber; j++) {
            const tokenid = await ncontract.tokenOfOwnerByIndex(accounts[i], j);
            const tokenidNumber = Number(tokenid._hex);
            //console.log("tokenid", tokenidNumber);
            const data = await ncontract.getData(tokenidNumber);
            DataArray.push(data);
            //console.log("dataaaaaaaaaaa", data);
            //newDataArray.push(tokenidNumber);
            // setData(...Data,DataArray);
          }

          // setIds((prevIds) => [...prevIds, ...newDataArray]);
          setIsLoading(false);
        }
        console.log("newData ....", DataArray)
        setData( [ ...DataArray]);
      } catch (error) {
        console.log("error", error);
      }
    };
    getIds();
  }, [accounts]);

  //console.log("DataArray of all", Data);

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center 2xl:px-[225px] bottom-0 h-full py-14">
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
            <div className="flex flex-wrap gap-6">
              {Data
                ? Data.map((items, index) => {
                    const name = items[0];
                    const price = Number(items[1]._hex);
                    const desc = items[2];
                    const i = items[3];

                    return (
                      <>
                        <div
                          key={index}
                          className="w-[250px] h-[350px] bg-[#0b1138] rounded overflow-hidden shadow-lg my-4 "
                        >
                          <img
                            className="w-full h-[70%] object-cover"
                            src={i}
                            alt="Sunset in the mountains"
                          />
                          <div className="px-6 py-2">
                            <div className="flex items-center justify-between">
                              <div className="font-bold text-xl mb-2 flex items-center">
                                {name}
                              </div>
                              <button className="border border-1 border-gray-600 px-3 py-1 rounded-full hover:bg-gray-600">
                                Buy
                              </button>
                            </div>
                            <div className="font-semibold text-base mb-2">
                              {price}Eth
                            </div>
                            <p className="text-sm text-gray-300">{desc}</p>
                          </div>
                        </div>
                      </>
                    );
                  })
                : ""}
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default HomePage;
