import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "../../hooks";
import { useToken, useValues } from "../../hooks";

export function Tokens() {
  const { address, isConnected } = useAccount();
  const { useEthersSigner } = useConnect();
  const { getBalanceTokens, getBalanceTokensSC, getBalanceEthersSC, buyTokens, initLotteryToken, returnTokens } = useToken();
  const { inputValues, handleInputValues } = useValues()

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
      <h1 className="text-white text-5xl font-bold">
        Token ERC-20 Management
      </h1>

      <section className="flex justify-center gap-10 items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="text-white text-xl font-normal">USER TOKENS</h3>
          <button
            type="button"
            onClick={getBalanceTokens}
            className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#202850] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#5081c0]"
          >
            TOKENS BALANCE
          </button>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="text-white text-xl font-normal">TOKENS SC</h3>
          <button
            type="button"
            onClick={getBalanceTokensSC}
            className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#504720] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#c0b950]"
          >
            TOKENS (SC) BALANCE
          </button>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center">
          <h3 className="text-white text-xl font-normal">ETHERS SC</h3>
          <button
            type="button"
            onClick={getBalanceEthersSC}
            className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#502720] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#c06650]"
          >
            ETHERS (SC) BALANCE
          </button>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center gap-2 w-[20rem]">
        <input 
          type="number" 
          onChange={e => handleInputValues("buyTokensValue", Number(e.target.value))}
          className="w-full py-2 px-3 rounded-lg gap-2 bg-transparent border border-[rgba(102,102,102,0.49)] outline-none dark:text-[#e2e2e2]" 
          placeholder="Number of tokens"
          value={inputValues.buyTokensValue}
        />
        <button
            type="button"
            onClick={() => buyTokens(inputValues.buyTokensValue)}
            className="px-4 w-[50%] py-2 flex items-center justify-center rounded-lg border scale-100 border-[#2b5020] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#63c050]"
          >
            BUY TOKENS
          </button>
      </section>
      <section className="flex flex-col justify-center items-center gap-2 w-[20rem]">
        <h2 className="text-white text-3xl font-medium">Token ERC-20 return</h2>
        <input 
          type="number" 
          onChange={e => handleInputValues("returnTokensValue", Number(e.target.value))}
          className="w-full py-2 px-3 rounded-lg gap-2 bg-transparent border border-[rgba(102,102,102,0.49)] outline-none dark:text-[#e2e2e2]" 
          placeholder="Number of tokens"
          value={inputValues.returnTokensValue}
        />
        <button
            type="button"
            onClick={() => returnTokens(inputValues.returnTokensValue)}
            className="px-4 w-[50%] py-2 flex items-center justify-center rounded-lg border scale-100 border-[#2b5020] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#63c050]"
          >
            RETURN TOKENS
          </button>
      </section>
    </section>
  );
}
