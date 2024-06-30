// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lottery is ERC20, Ownable {

    // =====================================
    // Token Management
    // =====================================

    // NFT contract address of the project
    address public nft;

    // Constructor
    constructor(address initialOwner) Ownable(initialOwner) ERC20("Lottery", "AR"){
        _mint(address(this), 10000);
        nft = address(new mainERC721());
    }

    // Lottery prize winner
    address public winner;

    // User registration
    mapping(address => address) public userContract; // Stores the address of a user linked to the address
    // of their smart contract

    // Price of ERC-20 tokens
    function tokenPrice(uint256 _numTokens) internal pure returns(uint256){
        return _numTokens * (1 ether);
    }

    // Viewing the ERC-20 token balance of a user
    function tokenBalance(address _account) public view returns (uint256){
        return balanceOf(_account);
    }

    // Viewing the ERC-20 token balance of the smart contract
    function tokenBalanceSC() public view returns (uint256){
        return balanceOf(address(this));
    }

    // Viewing the ether balance of the Smart Contract
    // 1 ether -> 10^18 wei
    function etherBalanceSC() public view returns(uint256) {
        return address(this).balance / 10**18;
    }

    // Minting new ERC-20 tokens
    function mint(uint256 _amount) public onlyOwner {
        _mint(address(this), _amount);
    }

    // User registration
    function register() internal {
        address personalContractAddr = address(new LotteryTicketsNFTs(msg.sender, address(this), nft));
        userContract[msg.sender] = personalContractAddr;
    }

    // User information
    function userInfo(address _account) public view returns(address){
        return userContract[_account];
    }

    // Purchase of ERC-20 tokens
    function buyTokens(uint256 _numTokens) public payable{
        // User registration
        if(userContract[msg.sender] == address(0)){
            register();
        }
        // Setting the cost of the tokens to buy
        uint256 cost = tokenPrice(_numTokens);
        // Evaluating the money the client pays for the tokens
        require(msg.value >= cost, "Buy fewer tokens or pay with more ethers");
        // Getting the number of ERC-20 tokens available
        uint256 balance = etherBalanceSC();
        require(_numTokens <= balance, "Buy a smaller number of tokens");
        // Returning the excess money
        uint256 returnValue = msg.value - cost;
        // The smart contract returns the remaining amount
        payable(msg.sender).transfer(returnValue); // Sends ethers
        // Sending tokens to the client/user
        _transfer(address(this), msg.sender, _numTokens); // Sends tokens
    }

    // Returning tokens to the smart contract
    function returnTokens(uint _numTokens) public payable {
        // The number of tokens must be greater than 0
        require(_numTokens > 0, "You need to return a number of tokens greater than 0");
        // The user must prove they have the tokens they want to return
        require(_numTokens <= tokenBalance(msg.sender), "You do not have the tokens you want to return");
        // The user transfers the tokens to the smart contract
        _transfer(msg.sender, address(this), _numTokens);
        // The smart contract sends ethers to the user
        payable(msg.sender).transfer(tokenPrice(_numTokens));
    }

    // =====================================
    // Lottery Management
    // =====================================

    // Lottery ticket price (in ERC-20 tokens)
    uint public ticketPrice = 5;
    // Relationship: person who buys the tickets -> the number of the tickets
    mapping(address => uint []) personTickets;
    // Relationship: ticket -> winner
    mapping(uint => address) ticketDNA;
    // Random number
    uint randNonce = 0;
    // Purchased lottery tickets
    uint [] purchasedTickets;
    
    // Purchase of lottery tickets
    function buyTicket(uint _numTickets) public {
        // Total price of the tickets to buy
        uint totalPrice = _numTickets * ticketPrice;
        // Verification of user tokens
        require(totalPrice <= tokenBalance(msg.sender), "You do not have enough tokens");
        // Transfer of user tokens to the smart contract
        _transfer(msg.sender, address(this), totalPrice);
        /* Collects the timestamp (block.timestamp), msg.sender and a Nonce
        (a number that is only used once, so we do not execute the same hash function
        twice with the same input parameters) in increment.
        'keccak256' is used to convert these inputs to a random hash, convert that hash to a uint
        and then use % 10000 to take the last 4 digits giving a random value between 0 - 9999 */
        for (uint i = 0; i < _numTickets; i++){
            uint random = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % 100000;
            randNonce++;
            // Storing the ticket data linked to the user
            personTickets[msg.sender].push(random);
            // Storing the ticket data
            purchasedTickets.push(random);
            // Assigning the ticket DNA to generate a winner
            ticketDNA[random] = msg.sender;
            // Creating a new NFT for the ticket number
            LotteryTicketsNFTs(userContract[msg.sender]).mintTicket(msg.sender, random);
        }
    }
    
    // Viewing user tickets
    function yourTickets(address _owner) public view returns(uint [] memory){
        return personTickets[_owner];
    }

    // Generating the lottery winner
    function generateWinner() public {
        // Ensure the caller is the owner
        require(msg.sender == owner(), "Caller is not the owner");
    
        // Declaration of the array length
        uint length = purchasedTickets.length;
        // Verification of at least one ticket purchase
        require(length > 0, "No tickets have been purchased so far.");
        // Random selection of a number between: [0-Length]
        uint random = uint(uint(keccak256(abi.encodePacked(block.timestamp))) % length);
        // A hash is generated, that hash is passed to a number and we generate with the module a number that
        // is within the array length. And then we make sure to return a number
        // Selecting the random number
        uint choice = purchasedTickets[random];
        // Address of the lottery winner
        winner = ticketDNA[choice];
        // Sending 95% of the lottery prize to the winner
        payable(winner).transfer(address(this).balance * 95 / 100);
        // Sending 5% of the prize to the Owner
        payable(owner()).transfer(address(this).balance * 5 / 100);
    }


}

// NFT Smart Contract
contract mainERC721 is ERC721 {

    address public lotteryAddress;
    constructor() ERC721("Lottery", "STE"){
        lotteryAddress = msg.sender;
    }

    // Creating NFTs
    function safeMint(address _owner, uint256 _ticket) public {
        require(msg.sender == Lottery(lotteryAddress).userInfo(_owner),
        "You do not have permission to execute this function");
        _safeMint(_owner, _ticket);
    }

}

contract LotteryTicketsNFTs {

    // Relevant owner data
    struct Owner{
        address ownerAddress;
        address parentContract;
        address nftContract;
        address userContract;
    }
    // Data structure of type owner
    Owner public owner;
    // Constructor of the Smart Contract (child)
    constructor(address _owner, address _parentContract, address _nftContract){
        owner = Owner(_owner, _parentContract, _nftContract, address(this));
    }

    // Conversion of lottery ticket numbers
    function mintTicket(address _owner, uint _ticket) public {
        require(msg.sender == owner.parentContract, "You do not have permission to execute this function");
        mainERC721(owner.nftContract).safeMint(_owner, _ticket);
    }
}
