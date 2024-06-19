import { useState } from 'react';

import Orderbook from './Orderbook';
import './App.css';

function App() {
  const [network, setNetwork] = useState("testnet"); // Set test network as default

  const onChangeNetwork = (e) => setNetwork(e.target.value);

  return (
    <main>
      <section>
        <header>
          <label>Choose Network:</label>
          <select value={network} onChange={onChangeNetwork}>
            <option value="testnet">Test Network</option>
            <option value="prod">Production Network</option>
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
