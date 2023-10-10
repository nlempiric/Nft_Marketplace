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
        string name;
        uint price;
        string desc;
        string tokenUri;
        string metadataTokenUri;
    } 
    mapping(uint => Details) public DetailsOfTokenID;

    
    event mintevent(address addOfSender, uint256 id , string name , uint price,string description,string tokenUri ,string metadataTokenUri);
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

    function mintTo(address recipient, string memory _name, uint _price, string memory _description, string memory _tokenUri ,string memory _metadataTokenUri) public onlyOwner returns (uint256)
    {
        require(recipient==getOwnerAddress(), "Only Owner Can mint");
        currentTokenId.increment();
        uint256 newItemId = currentTokenId.current();
        DetailsOfTokenID[newItemId]=Details(_name,_price,_description,_tokenUri,_metadataTokenUri);
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, _metadataTokenUri);


        emit mintevent(msg.sender,newItemId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        return newItemId;
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
        DetailsOfTokenID[_tokenId]=Details(_name,_price,_description,_tokenUri,_metadataTokenUri);
        _setTokenURI(_tokenId, _metadataTokenUri);
        emit metadataUpdated(_tokenId,_name,_price,_description,_tokenUri,_metadataTokenUri);
        return _metadataTokenUri;
    }    
 
}