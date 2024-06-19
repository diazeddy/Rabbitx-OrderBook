export const TEST_TOKEN = import.meta.env.VITE_TEST_TOKEN;
export const PROD_TOKEN = import.meta.env.VITE_PROD_TOKEN;
export const SYMBOL = import.meta.env.VITE_SYMBOL;
export const NETWORK_TYPE = Object.freeze({
  TEST: "testnet",
  PROD: "prod"
});
