export const NETWORK_TYPE = Object.freeze({
  TEST: "testnet",
  PROD: "prod"
});

export const Environment = {
  TEST_TOKEN: import.meta.env.VITE_TEST_TOKEN,
  PROD_TOKEN: import.meta.env.VITE_PROD_TOKEN,
  SYMBOL: import.meta.env.VITE_SYMBOL
};