// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract NFT is ERC721 ,ERC721Enumerable,Ownable ,ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private currentTokenId;
    string public baseTokenURI;
  

    struct Details{
        address add;
        uint tokenId;
        string name;
        uint price;
        string desc;
        string tokenUri;
        string metadataTokenUri;
    } 

    mapping(uint => Details) public DetailsOfTokenID;
    mapping(address => uint[]) public sellingTokenIdsByAddress;
    mapping(address => uint[]) public TokenIdsByAddress;
    mapping(uint => bool) public isNftListed;



    event mintevent(address addOfSender, uint256 id , string name , uint price,string description,string tokenUri ,string metadataTokenUri);
    event buyNftEvent(address FromAddress,address toAddreess, uint256 id );
    event metadataUpdated(uint tokenId, string newName,uint256 newPrice,string newDescription,string newImg,string metadataTokenUri);

    constructor() ERC721("NFTTutorial", "NFT") {}

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable,ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function mintTo(string memory _name, uint _price, string memory _description, string memory _tokenUri ,string memory _metadataTokenUri) public returns (uint256)
    {
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        DetailsOfTokenID[newItemId]=Details(msg.sender,newItemId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _metadataTokenUri);
        TokenIdsByAddress[msg.sender].push(newItemId);
        emit mintevent(msg.sender,newItemId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        return newItemId;
    }

    function selldata(uint id) public   
    {
        require(_ownerOf(id) == msg.sender, "You are not the owner of this NFT");
        require(isNftListed[id]!=true, "NFT is already for sale");
        _approve(address(this),id);
        sellingTokenIdsByAddress[msg.sender].push(id);
        isNftListed[id]=true;

    }

    function getsellingTokenIdsByAddress(address add) public view returns (uint[] memory) {
    return sellingTokenIdsByAddress[add];
    }

    function getTokenIdsByAddress(address add) public view returns (uint[] memory) {
    return TokenIdsByAddress[add];
    }

   function removeTokenIdsByAddress(address add, uint _ID) public 
   {
        uint[] storage tokenIds = TokenIdsByAddress[add];
        for (uint i = 0; i < tokenIds.length; i++) 
        {
            if (tokenIds[i] == _ID)
            {
                if (i < tokenIds.length - 1) {
                    tokenIds[i] = tokenIds[tokenIds.length - 1];
                }
                tokenIds.pop(); 
                return; 
            }
        }
    }

    function removeSell(address add, uint _ID) public 
    {
        uint[] storage tokenIds = sellingTokenIdsByAddress[add];
        for (uint i = 0; i < tokenIds.length; i++) 
        {
            if (tokenIds[i] == _ID) {
                if (i < tokenIds.length - 1) {
                    tokenIds[i] = tokenIds[tokenIds.length - 1];
                }
                tokenIds.pop(); 
                isNftListed[_ID]=false;
                return; 
            }
        }
    }

     function buyNft(uint id) public payable 
    {
        require(_exists(id), "Token ID does not exist");
        require(isNftListed[id]==true, "NFT is not listed for sale");
        uint price = DetailsOfTokenID[id].price;
        require(msg.value == price, "Incorrect amount sent"); 
        address fromAddress=_ownerOf(id);
        _transfer(fromAddress, msg.sender, id);
        removeSell(fromAddress,id);
        removeTokenIdsByAddress(fromAddress,id);
        isNftListed[id]=false;
        TokenIdsByAddress[msg.sender].push(id);
        if (msg.value > price) 
        {
            payable(msg.sender).transfer(msg.value - price);
        }
        emit buyNftEvent(fromAddress,msg.sender,id);
    }

      function getData (uint _id) public view returns(Details memory){
        return DetailsOfTokenID[_id];
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }


    function getOwnerAddress() public view returns (address) {
            return owner();
        }

    function Update(uint _tokenId,string memory _name, uint _price, string memory _description, string memory _tokenUri ,string memory _metadataTokenUri) public onlyOwner returns (string memory)
    {
        require(DetailsOfTokenID[_tokenId].price > 0, "Token ID does not exist");
        DetailsOfTokenID[_tokenId]=Details(msg.sender,_tokenId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        _setTokenURI(_tokenId, _metadataTokenUri);
        emit metadataUpdated(_tokenId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        return _metadataTokenUri;
    }    
 
}