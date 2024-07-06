# Lottery DApp

This project is a basic graphical interface built with React to demonstrate the functionality of a smart contract for a lottery system. The smart contract is written in Solidity and manages a lottery where users can buy tickets using ERC-20 tokens, and a winner is selected at random. The project also includes an NFT component for the lottery tickets.

## Project Description

The main purpose of this project is to provide a graphical representation of how a lottery smart contract works. It includes functionalities such as:
- Purchasing ERC-20 tokens.
- Buying lottery tickets with ERC-20 tokens.
- Viewing purchased tickets.
- Randomly selecting a lottery winner.
- Minting NFTs for lottery tickets.

## Prerequisites

To run this project locally, you need the following tools installed:
- Node.js
- npm (Node Package Manager)
- Ganache (for local Ethereum blockchain setup)

You can download Ganache from [here](https://www.trufflesuite.com/ganache).

## Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/lottery-dapp.git
   cd lottery-dapp

2. **Install dependencies**
   ```bash
    npm install

3. **Start ganache**
- Open Ganache and start a new workspace. Ensure that it is running on the default port (7545).

4. **Deploy the smart contract**
   ```bash
    npx hardhat run scripts/deploy.js --network ganache

5. **Run the application**
   ```bash
    npm run dev

6. **Open the application**
- Open your browser and navigate to http://localhost:3000 to view the application.

## Usage
The application provides a simple interface to interact with the lottery smart contract. Users can:
- Buy ERC-20 tokens with Ether.
- Purchase lottery tickets using ERC-20 tokens.
- View their purchased lottery tickets.
- Participate in the lottery draw and see the winner.

## Video Demonstration
For a detailed walkthrough of the project, please refer to the following video: [Demo video](https://www.youtube.com/watch?v=moWYEaP69PQ)
