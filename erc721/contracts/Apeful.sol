// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@hyperlane-xyz/core/contracts/token/libs/TokenRouter.sol";

interface IOracle {
    function createFunctionCall(
        uint functionCallbackId,
        string memory functionType,
        string memory functionInput
    ) external returns (uint i);
}

// the message recipient interface for hyperlane
interface IMessageRecipient {
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable;
}

contract Apeful is ERC721, ERC721URIStorage, ERC721Enumerable, IMessageRecipient {
    uint256 private _nextTokenId;

    struct MintInput {
        address owner;
        address recipient;
        string prompt;
        bool isMinted;
    }

    mapping(uint => MintInput) public mintInputs;
    uint private mintsCount;

    event MintInputCreated(address indexed owner, uint indexed chatId);

    address private owner;
    address public oracleAddress;
    address public tokenRouterAddress;

    bool public bridgingEnabled = false;

    string public prompt;

    event PromptUpdated(string indexed newPrompt);
    event OracleAddressUpdated(address indexed newOracleAddress);

    constructor(
        address initialOracleAddress,
        string memory initialPrompt
    ) ERC721("Apeful", "AF") {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        prompt = initialPrompt;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setPrompt(string memory newPrompt) public onlyOwner {
        prompt = newPrompt;
        emit PromptUpdated(newPrompt);
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function setTokenRouterAddress(address newTokenRouterAddress) public onlyOwner {
        tokenRouterAddress = newTokenRouterAddress;
    }

    function setBridgingEnabled(bool enabled) public onlyOwner {
        bridgingEnabled = enabled;
    }
    function initializeMint(address recipient, string memory message) public returns (uint i) {
        MintInput storage mintInput = mintInputs[mintsCount];

        mintInput.owner = address(this);
        mintInput.recipient = recipient;
        mintInput.prompt = message;
        mintInput.isMinted = false;

        uint currentId = mintsCount;
        mintsCount = currentId + 1;

        string memory fullPrompt = prompt;
        fullPrompt = string.concat(fullPrompt, message);
        fullPrompt = string.concat(fullPrompt, "\"");
        IOracle(oracleAddress).createFunctionCall(
            currentId,
            "image_generation",
            fullPrompt
        );
        emit MintInputCreated(msg.sender, currentId);

        return currentId;
    }

    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory
    ) public onlyOracle {
        MintInput storage mintInput = mintInputs[runId];
        require(!mintInput.isMinted, "NFT already minted");

        mintInput.isMinted = true;

        uint256 tokenId = _nextTokenId++;
        _mint(mintInput.owner, tokenId);
        _setTokenURI(tokenId, response);

        if (bridgingEnabled) {
            bridgeToSepolia(tokenId, mintInput.recipient);
        }
    }
    // The following functions are overrides required by Solidity.

    function setApproval() public {
        ERC721 _erc721 = ERC721(address(this));
        _erc721.setApprovalForAll(tokenRouterAddress, true);
    }

    function bridgeToSepolia(uint256 tokenId, address recipient) public {
        TokenRouter router = TokenRouter(tokenRouterAddress);
        router.transferRemote(
            11155111,
            bytes32(uint256(uint160(recipient))),
            tokenId
        );
    }
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721Enumerable) {
        return super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal virtual override(ERC721, ERC721URIStorage){
        return super._burn(tokenId);
    }

    // function _increaseBalance(address account, uint128 value)
    //     internal
    //     override(ERC721, ERC721Enumerable)
    // {
    //     super._increaseBalance(account, value);
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function handle(
        uint32,
        bytes32,
        bytes calldata _message
    ) external payable {
        (address recipient, string memory message) = abi.decode(_message, (address, string));

        initializeMint(recipient, message);
    }
}
