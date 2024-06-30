import { useEffect } from "react";
import { useConnect, useToken } from "../../hooks";
import { useAccount } from "wagmi";

export function Winner() {

  const { address, isConnected } = useAccount();
  const { winner, generateWinner, initLotteryToken } = useToken()
  const { useEthersSigner } = useConnect()

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
        Generation of the Lottery Winner
      </h1>

      <button
          type="button"
          onClick={generateWinner}
          className="px-4 py-2 flex gap-2 items-center justify-center rounded-lg border scale-100 border-[#202850] duration-75
          bg-stone-200 dark:text-white hover:scale-105 dark:bg-[#5081c0]"
        >
          GENERATE WINNER
        </button>

        {
            winner && (
                <span className="text-white text-2xl font-bold">
                    The winner is: ${winner}
                </span>
            )
        }
    </section>
  );
}
