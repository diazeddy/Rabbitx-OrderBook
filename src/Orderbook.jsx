import { useState, useEffect, useCallback } from "react";
import { Centrifuge } from 'centrifuge';

import PriceTable from "./PriceTable";
import { TEST_TOKEN, PROD_TOKEN, SYMBOL, NETWORK_TYPE } from "./constants";
import { getOrderBooks } from "./api";

const Orderbook = ({network}) => {
  const [bids, setBids] = useState(JSON.parse(localStorage.getItem(`bids-${network}`) ?? "{}"));
  const [asks, setAsks] = useState(JSON.parse(localStorage.getItem(`asks-${network}`) ?? "{}"));
  const [_, setSequenceNumber] = useState(Number(localStorage.getItem(`sequence-${network}`) ?? "-1"));

  const updateBids = useCallback((data) => {
    setBids((prev) => {
      const newBids = {...prev};
      data.forEach(([priceString, size]) => {
        const price = Number(priceString);
        // if size is 0, then remove data from bids
        if (size !== "0") {
          newBids[price] = size;
        } else if(size === "0" && newBids[price]) {
          delete newBids[price];
        }
      });
      // save updates bids data into localStorage
      localStorage.setItem(`bids-${network}`, JSON.stringify(newBids));
      return newBids;
    });
  }, [network]);

  const updateAsks = useCallback((data) => {
    setAsks((prev) => {
      const newAsks = {...prev};
      data.forEach(([priceString, size]) => {
        const price = Number(priceString);
        // if size is 0, then remove data from asks
        if (size !== "0") {
          newAsks[price] = size;
        } else if(size === "0" && newAsks[price]) {
          delete newAsks[price];
        }
      });
      // save updates asks data into localStorage
      localStorage.setItem(`asks-${network}`, JSON.stringify(newAsks));
      return newAsks;
    });
  }, [network]);

  const updateSequenceNumber = useCallback(async (prev) => {
    try {
      const res = await getOrderBooks(network, SYMBOL);
      if (res.result[0].sequence >= prev) {
        updateBids(res.result[0].bids);
        updateAsks(res.result[0].asks);
        return res.result.sequence;
      }
    } catch (error) {
      return prev;
    }
  }, [network, SYMBOL]);

  useEffect(() => {
    // Initialize data by network type
    setBids(JSON.parse(localStorage.getItem(`bids-${network}`) ?? "{}"));
    setAsks(JSON.parse(localStorage.getItem(`asks-${network}`) ?? "{}"));
    setSequenceNumber(updateSequenceNumber);
    
    // Get token by network type    
    const token = network === NETWORK_TYPE.PROD ? PROD_TOKEN : TEST_TOKEN;
    if (token) {
      // Initialize Centrifuge
      const centrifuge = new Centrifuge(`wss://api.${network}.rabbitx.io/ws`, { token: token });

      // Subscribe to orderbook channel
      const subscription = centrifuge.newSubscription(`orderbook:${SYMBOL}`);

      // Handle incoming orderbook updates
      subscription.on('publication', (ctx) => {
        const data = ctx.data;
        setSequenceNumber(async (prev) => {
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
            // save updates seqeunce number into localStorage
            localStorage.setItem(`sequence-${network}`, data.sequence.toString());
            return data.sequence;
          }
        });
      });

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
