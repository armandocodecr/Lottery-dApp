import { useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

import { useConnect } from "./useConnect";

import addresses from "../contracts/addresses.json";

import LotteryToken from "../../artifacts/contracts/Lottery.sol/Lottery.json";
import Swal from "sweetalert2";

export function useToken() {
  const { address, isConnected } = useAccount();

  const { useEthersSigner } = useConnect();
  const [winner, setWinner] = useState("")
  const provider = useEthersSigner();
  const [lotteryToken, setLotteryToken] = useState<ethers.Contract | null>(null);

  const initLotteryToken = async () => {
    const signer = provider;

    const lotteryBalance = new ethers.Contract(
      addresses.loteria,
      LotteryToken.abi,
      signer
    );
    handleLotteryToken(lotteryBalance);
  };

  const getWinner = async () => {
    if (isConnected && provider) {
      const winner = await lotteryToken!.winner();
      console.log({ winner })
      setWinner(winner.toString())
    }
  }

  const getBalanceTokens = async () => {
    if (isConnected && provider) {
      const tokenBalance = await lotteryToken!.tokenBalance(address);
      Swal.fire({
        icon: "info",
        title: "Your balance is:",
        width: 600,
        padding: "1em",
        text: `${tokenBalance} token/s`,
      });
    }
  };

  const getBalanceTokensSC = async () => {
    if (isConnected && provider) {
      const tokenSCBalance = await lotteryToken!.tokenBalanceSC();
      Swal.fire({
        icon: "info",
        title: "Your Smart Contract balance is:",
        width: 600,
        padding: "1em",
        text: `${tokenSCBalance.toString()} Tokens`,
      });
    }
  };

  const getBalanceEthersSC = async () => {
    if (isConnected && provider) {
      const ethersSCBalance = await lotteryToken!.etherBalanceSC();
      Swal.fire({
        icon: "info",
        title: "The ether balance is:",
        width: 600,
        padding: "1em",
        text: `${ethersSCBalance.toString()} ETH`,
      });
    }
  };

  const buyTokens = async (numTokens: number) => {
    if (isConnected && provider) {
      try {
        const weiValue  = ethers.utils.parseUnits(numTokens.toString(), 'ether');
        const tx = await lotteryToken!.buyTokens(numTokens, { value: weiValue });
        await tx.wait();
        const etherValue = weiValue.div(ethers.BigNumber.from(10).pow(18));
        Swal.fire({
          icon: "success",
          title: "Token purchase made!",
          width: 600,
          padding: "1em",
          text: `You have purchased ${numTokens.toString()} token/s worth ${etherValue} ether/s`,
        });
      } catch (error: any) {
        const formattedError = error.data.message.split('revert')[1].slice(1)
        Swal.fire({
          icon: "error",
          title: formattedError,
          width: 600,
          padding: "1em",
        });
      }
    }
  };

  const returnTokens = async (numTokens: number) => {
    if (isConnected && provider) {
      try {
        const tx = await lotteryToken!.returnTokens(numTokens);
        await tx.wait();
        Swal.fire({
          icon: "warning",
          title: "Token return!",
          width: 600,
          padding: "1em",
          text: `You have returned ${numTokens.toString()} token/s`,
        });
      } catch (error: any) {
        const formattedError = error.data.message.split('revert')[1].slice(1)
        Swal.fire({
          icon: "error",
          title: formattedError,
          width: 600,
          padding: "1em",
        });
      }
    }
  };

  const buyTickets = async (numberOfTickets: number) => {
    if (isConnected && provider) {
      try {
        const tx = await lotteryToken!.buyTicket(numberOfTickets);
        await tx.wait();
        Swal.fire({
          icon: "success",
          title: "The tickets have been purchased successful!",
          width: 600,
          padding: "1em",
          text: `You have purchased ${numberOfTickets} ticket/s`,
        });
      } catch (error: any) {
        const formattedError = error.data.message.split('revert')[1].slice(1)
        Swal.fire({
          icon: "error",
          title: formattedError,
          width: 600,
          padding: "1em",
        });
      }
    }
  };

  const generateWinner = async () => {
    if (isConnected && provider && lotteryToken) {
      try {
        const action = await lotteryToken.generateWinner({ from: address });
        await action.wait();
        Swal.fire({
          icon: "success",
          title: "Winner generated correctly!",
          width: 600,
          padding: "1em",
        });
      getWinner()
      } catch (error: any) {
        console.log({ error })
        const formattedError = error.data.message.split('revert')[1].slice(1)
        Swal.fire({
          icon: "error",
          title: formattedError,
          width: 600,
          padding: "1em",
        });
      }
    }
  }

  const handleLotteryToken = (value: ethers.Contract | null) => {
    setLotteryToken(value);
  };

  return {
    // Variables
    lotteryToken,
    winner,

    //Function
    handleLotteryToken,
    getBalanceTokens,
    getBalanceTokensSC,
    getBalanceEthersSC,
    buyTokens,
    initLotteryToken,
    returnTokens,
    buyTickets,
    generateWinner,
  };
}
