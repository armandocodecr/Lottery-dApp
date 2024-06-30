import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "../../hooks";
import { useToken, useValues } from "../../hooks";

export function Lottery() {
  const { address, isConnected } = useAccount();
  const { useEthersSigner } = useConnect();
  const { initLotteryToken, buyTickets } = useToken();
  const { handleInputValues, getUserTickets, inputValues, ticketPrice } = useValues()

  const provider = useEthersSigner();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      window.alert("¡Deberías considerar usar Metamask!");
    }
  };
  
  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    initLotteryToken()
  }, [isConnected, provider, address]);

  return (
    <section className="w-full h-screen flex flex-col gap-10 justify-center items-center">
      <h1 className="text-white text-5xl font-bold">Tokens Lottery Management ERC-20 and ERC-721</h1>
      <h2 className="text-white text-2xl font-medium">Purchase of tickets</h2>
      <div className="flex flex-col justify-center items-center gap-2 w-[20rem]">
        <input 
          type="number" 
          onChange={e => handleInputValues("buyTicketsValue", Number(e.target.value))}
          className="w-full py-2 px-3 rounded-lg gap-2 bg-transparent border border-[rgba(102,102,102,0.49)] outline-none dark:text-[#e2e2e2]" 
          placeholder="Number of tokens"
          value={inputValues.buyTicketsValue}
        />
        <button
            type="button"
            onClick={() => buyTickets(inputValues.buyTicketsValue)}
            className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#202850] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#5081c0]"
        >
            BUY TICKETS
        </button>
      </div>
      <div className="flex justify-between items-center gap-2 w-[20rem]">
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-white text-xl font-medium">Tickets price</h3>
          <span className="text-white text-lg font-normal">{`${ticketPrice} tokens`}</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <h3 className="text-white text-xl font-medium">Your tickets</h3>
          <button
            type="button"
            onClick={getUserTickets}
            className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#502720] duration-75
           bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#c06650]"
          >
            VIEW YOUR TICKETS
          </button>
        </div>
      </div>
    </section>
  );
}
