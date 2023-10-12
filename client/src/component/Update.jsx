import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useNavigate, Navigate } from "react-router-dom";
import Loader from "react-js-loader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Update = ({ ncontract, client }) => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [tokenIds, settokenIds] = useState([]);
  const [tid, setTid] = useState();
  const [imageChanged, setimageChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [Data, setData] = useState({
    price: null,
    name: null,
    description: null,
    _imgUrl: null,
  });

  const [img, setimg] = useState();

  const changeHandlerTokenId = (e) => {
    setTid(e.target.value);
  };

  const handleChangeData = (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    console.log("-------------", URL.createObjectURL(e.target.files[0]));
    setData({
      ...Data,
      _imgUrl: URL.createObjectURL(e.target.files[0]),
      imgUrl: e.target.files[0],
    });
    setimageChanged(true);
  };

  async function fetchImageAsBlob(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }
  const handleUpdate = async () => {
    if (
      Data.name != "" &&
      Data.price > 0 &&
      Data.description != "" &&
      Data.img != ""
    ) {
      try {
        setIsLoading(true); 
        var imageFile;
        if (imageChanged) {
          imageFile = new File([Data.imgUrl], "nft.png", { type: "image/png" });
          console.log("imageFileee", imageFile);
        } else {
          const data1 = await fetchImageAsBlob(Data._imgUrl);
          imageFile = new File([data1], "nft.png", { type: "image/jpeg" });
          console.log("imageFileee", imageFile);
        }

        const metaData = await client.store({
          name: Data.name,
          price: Data.price,
          description: Data.description,
          image: imageFile,
        });

        const imgurl1 = metaData.data.image.pathname;
        const i = imgurl1.replace("/nft.png", ".ipfs.dweb.link/nft.png");
        const url = i.replace("//", "https://");

        const cid = metaData.ipnft;

        const updateData = await ncontract.Update(
          tid,
          Data.name,
          Data.price,
          Data.description,
          url,
          cid
        );
        const up = await updateData.wait();

        console.log("Updated successfully");
        // alert("Updated Successfully");
        toast.success("update Successfuly")
      } catch (err) {
        console.log(err);
        toast.error("Error in updating NFT")
      }
      finally
      {
        setIsLoading(false); 

      }
    } else {
      console.log("Fill The Data To update");
      toast.warning('Please Fill All the Fields')
    }
  };


  useEffect(() => {
    const getIds = async () => {
      try {
        const balance = await ncontract.balanceOf(address);
        const balancinNumber = Number(balance._hex);
        const newDataArray = [];

        for (let i = 0; i < balancinNumber; i++) {
          const tokenid = await ncontract.tokenOfOwnerByIndex(address, i);
          const tokenidNumber = Number(tokenid._hex);
        //   console.log("tokenId", tokenidNumber);
          newDataArray.push(tokenidNumber);
        }

        settokenIds(newDataArray);
      } catch (error) {
        console.log(error);
      }
    };
    getIds();
  }, [address]);

  const getData = async () => {
    try {
      const t = Number(tid);
      const data = await ncontract.getData(t);
      console.log("dataaaaa", data);
      setData({
        name: data[2],
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
                    Update NFT
                    <span
                      className="absolute top-[0.30vmin] left-[-1px] transform-origin-left text-[#1c346d] transition-transform transform-rotate-y-25"
                      style={{
                        transition:
                          "0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        transform: "rotateY(2deg)",
                      }}
                    >
                      Update NFT
                    </span>
                  </span>
                </div>
                <div>
                  <select
                    id="tokenId"
                    name="tokenId"
                    onChange={changeHandlerTokenId}
                    className="border border-1 border-gray-600 p-3 rounded-md bg-transparent w-full"
                  >
                    <option value="">Select a Token ID</option>
                    {tokenIds.map((tokenId,index) => (
                      <option key={index} value={tokenId}>
                        {tokenId}
                      </option>
                    ))}
                  </select>
                </div>
  
                {tid ? (
                  <>
                    <div className="flex justify-around w-full my-6">
                      <div className="w-full flex flex-col gap-2 justify-center items-center">
                        <div className="w-[260px] h-[350px]">
                          <img
                            src={Data._imgUrl}
                            className="w-full h-[100%] object-cover"
                            alt=""
                          />
                        </div>
                        <div className="flex">
                          <input
                            className="file:text-white file:border file:border-1 file:border-white py-2 flex items-center rounded-md text-sm file:bg-transparent file:py-2 file:px-4 hover:file:bg-[#0b1138] file:rounded-md "
                            onChange={handleImageChange}
                            name="img"
                            type="file"
                          />
                          <br />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          className="border border-1 border-gray-600 p-2 rounded-md "
                          name="name"
                          value={Data.name}
                          type="text"
                          placeholder="Name"
                          onChange={handleChangeData}
                        />
                        <br />
                        <input
                          className="border border-1 border-gray-600 p-2 rounded-md "
                          name="price"
                          value={Data.price}
                          type="number"
                          placeholder="price"
                          onChange={handleChangeData}
                        />
                        <br />
                        <input
                          className="border border-1 border-gray-600 p-2 rounded-md "
                          name="description"
                          value={Data.description}
                          type="text"
                          placeholder="description"
                          onChange={handleChangeData}
                        />
                        <br />
                        <button
                          className="bg-blue-500 border border-blue-500 p-3 px-4 rounded-xl text-white hover:bg-transparent hover:text-blue-500"
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
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

export default Update;
