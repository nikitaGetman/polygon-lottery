import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const accounts = process.env.REACT_APP_PRIVATE_KEY
  ? [process.env.REACT_APP_PRIVATE_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    goerli: {
      url: process.env.REACT_APP_GOERLI_RPC_URL,
      accounts,
    },
    mumbai: {
      url: process.env.REACT_APP_MUMBAI_RPC_URL,
      accounts,
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.REACT_APP_GOERLI_ETHERSCAN_KEY || "",
      mumbai: process.env.REACT_APP_MUMBAI_ETHERSCAN_KEY || "",
    },
    customChains: [
      {
        network: "goerli",
        chainId: 4,
        urls: {
          apiURL: "https://api-goerli.etherscan.io/api",
          browserURL: "https://goerli.etherscan.io",
        },
      },
      {
        network: "mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};

export default config;
