import { useState } from 'react';

import Orderbook from './Orderbook';
import { NETWORK_TYPE } from './constants';
import './App.css';

function App() {
  const [network, setNetwork] = useState(NETWORK_TYPE.TEST); // Set test network as default

  const onChangeNetwork = (e) => setNetwork(e.target.value);

  return (
    <main>
      <section>
        <header>
          <label>Choose Network:</label>
          <select value={network} onChange={onChangeNetwork}>
            <option value={NETWORK_TYPE.TEST}>Test Network</option>
            <option value={NETWORK_TYPE.PROD}>Production Network</option>
          </select>
        </header>

        <div>
          <Orderbook network={network}/>
        </div>
      </section>
    </main>
  )
}

export default App
