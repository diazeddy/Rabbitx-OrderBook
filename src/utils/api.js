import axios from "axios";

export const getOrderBooks = async (network, symbol) => {
  const res = await axios.get(`https://api.${network}.rabbitx.io/markets/orderbook?market_id=${symbol}`);
  return res.data;
}