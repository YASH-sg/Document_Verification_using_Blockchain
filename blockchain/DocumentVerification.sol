// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DocumentRegistry {
    // We map the SHA-256 hash (bytes32) to the IPFS CID (string)
    mapping(bytes32 => string) private hashToCid;
    mapping(bytes32 => address) private docOwner;

    event DocumentRegistered(bytes32 indexed fileHash, string ipfsCid, address owner);

    function registerDocument(bytes32 _fileHash, string memory _ipfsCid) public {
        require(bytes(hashToCid[_fileHash]).length == 0, "Document already registered!");
        
        hashToCid[_fileHash] = _ipfsCid;
        docOwner[_fileHash] = msg.sender;

        emit DocumentRegistered(_fileHash, _ipfsCid, msg.sender);
    }

    function getCid(bytes32 _fileHash) public view returns (string memory) {
        require(bytes(hashToCid[_fileHash]).length != 0, "Document not found!");
        return hashToCid[_fileHash];
    }
}