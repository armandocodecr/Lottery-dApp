import { useEffect, useState } from "react";
import { useToken } from "./useToken";
import { useAccount } from "wagmi";
import { useConnect } from "./useConnect";
import Swal from "sweetalert2";


export function useValues() {

    const { address, isConnected } = useAccount()
    const { useEthersSigner } = useConnect();
    const [inputValues, setInputValues] = useState({
        buyTokensValue: 0,
        returnTokensValue: 0,
        buyTicketsValue: 0,
    })
    const provider = useEthersSigner();
    const [ticketPrice, setTicketPrice] = useState<string>("0");
    const { lotteryToken, initLotteryToken } = useToken()

    const getUserTickets = async () => {
        if (isConnected && lotteryToken) {
          const tickets = await lotteryToken.yourTickets(address);
          if(tickets.length === 0){
            Swal.fire({
                icon: "info",
                title: "You do not have purchased tickets",
                width: 600,
                padding: "1em",
              });
          } else {
            Swal.fire({
                icon: "info",
                title: "Your tickets:",
                width: 600,
                padding: "1em",
                text: tickets 
            });
          }
        }
    }

    const getTicketPrice = async () => {
        if (isConnected && lotteryToken) {
          const ticketPrice = await lotteryToken.ticketPrice();
          setTicketPrice(ticketPrice.toString())
        }
    }

    useEffect(() => {
        getTicketPrice()
    }, [lotteryToken]);

    useEffect(() => {
        initLotteryToken()
    }, [isConnected, provider, address]);

    const handleInputValues = ( key: string, value: number ) => {
        setInputValues((prev) => ({
            ...prev,
            [key]: value
        }))
    }
    return{
        // Variables
        inputValues,
        ticketPrice,

        // Functions
        handleInputValues,
        getUserTickets
    }

}