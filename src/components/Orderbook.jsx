import { useState, useEffect, useRef } from "react";
import { Centrifuge } from 'centrifuge';

import PriceTable from "./PriceTable";
import { Environment, NETWORK_TYPE } from "../utils/constants";
import { getOrderBooks } from "../utils/api";
import { getBidData, getAskData, getSequenceNumber, saveBidData, saveAskData, saveSequenceNumber } from "../utils/storage";

const Orderbook = ({ network }) => {
  const [bids, setBids] = useState({});
  const [asks, setAsks] = useState({});
  const sequenceNumberRef = useRef(getSequenceNumber(network));

  const updateBids = (data) => {
    setBids((prevBids) => {
      const newBids = { ...prevBids };
      data.forEach(([priceString, sizeString]) => {
        const price = Number(priceString);
        const size = Number(sizeString);
        // if size is 0, then remove data from bids
        if (size) {
          newBids[price] = size;
        } else if(newBids[price]) {
          delete newBids[price];
        }
      });
      // save updated bids data into localStorage
      saveBidData(network, newBids);
      return newBids;
    });
  };

  const updateAsks = (data) => {
    setAsks((prevAsks) => {
      const newAsks = { ...prevAsks };
      data.forEach(([priceString, sizeString]) => {
        const price = Number(priceString);
        const size = Number(sizeString);
        // if size is 0, then remove data from asks
        if (size) {
          newAsks[price] = size;
        } else if(newAsks[price]) {
          delete newAsks[price];
        }
      });
      // save updated asks data into localStorage
      saveAskData(network, newAsks);
      return newAsks;
    });
  };

  const updateSequenceNumber = async (prev) => {
    try {
      const res = await getOrderBooks(network, Environment.SYMBOL);
      if (res.result[0].sequence >= prev) {
        updateBids(res.result[0].bids);
        updateAsks(res.result[0].asks);
        sequenceNumberRef.current = res.result[0].sequence;
      }
    } catch (error) {
      console.error(error);
      sequenceNumberRef.current = prev;
    }
  };  

  const updateOrderbook = async (ctx) => {
    const data = ctx.data;
    const prev = sequenceNumberRef.current;
    // check the received sequence is correct
    if (prev >= 0 && prev !== data.sequence && prev !== data.sequence - 1) {
      if (prev < data.sequence) {
        return await updateSequenceNumber(prev);
      } else {
        return prev;
      }
    } else {
      // Update bids and asks if the sequence is correct
      updateBids(data.bids);
      updateAsks(data.asks);
      // save updates sequence number into localStorage
      saveSequenceNumber(network, data.sequence);
      return data.sequence;
    }
  }

  useEffect(() => {
    // Initialize data by network type
    setBids(getBidData(network));
    setAsks(getAskData(network));
    updateSequenceNumber(sequenceNumberRef.current);
    
    // Get token by network type    
    const token = network === NETWORK_TYPE.PROD ? Environment.PROD_TOKEN : Environment.TEST_TOKEN;
    if (token) {
      // Initialize Centrifuge
      const centrifuge = new Centrifuge(`wss://api.${network}.rabbitx.io/ws`, { token: token });

      // Subscribe to orderbook channel
      const subscription = centrifuge.newSubscription(`orderbook:${Environment.SYMBOL}`);

      // Handle incoming orderbook updates
      subscription.on('publication', updateOrderbook);

      // Subscribe to the channel
      subscription.subscribe();

      // Reconnect and resubscribe on disconnection
      centrifuge.on('disconnected', () => {
        centrifuge.connect();
        subscription.subscribe();
      });

      // Connect server
      centrifuge.connect();

      return () => {
        subscription.unsubscribe();
        centrifuge.disconnect();
      }
    }
  }, [network]);

  return (
    <div className="row">
      <article>
        <header>Bid</header>
        <PriceTable data={bids} />
      </article>
      <article>
        <header>Ask</header>
        <PriceTable data={asks} />
      </article>
    </div>
  )
}

export default Orderbook;
