import { useState } from "react";

import PriceTable from "./PriceTable";

const Orderbook = ({network}) => {
  const [bids, setBids] = useState(JSON.parse(localStorage.getItem(`bids-${network}`) ?? "{}"));
  const [asks, setAsks] = useState(JSON.parse(localStorage.getItem(`asks-${network}`) ?? "{}"));

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
