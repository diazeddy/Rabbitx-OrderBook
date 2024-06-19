# Rabbitx-OrderBook
Create a ReactJS UI component to synchronize and display an orderbook using websocket updates.

## Challenges
- Implement logic to handle network connection disruptions, including automatic reconnection and resubscription.
- Merge existing bids and asks with incoming websocket updates, keeping the orderbook up-to-date.

## Environment
- Windows 11
- Node v16.20.2
- Npm 8.19.4

## Tech Stacks
- React
- centrifuge-js
- Websocket
- RabbitX API

## Steps to run the project
1. Install node modules
   ```shell
   npm install
   ```
2. Create .env
   ```
   VITE_TEST_TOKEN="JWT token for test network"
   VITE_PROD_TOKEN="JWT token for production network"
   VITE_SYMBOL="Order Book Symbol"
   ```
3. Run project
   ```shell
   npm run dev
   ```
   This will host project on http://localhost:5173.