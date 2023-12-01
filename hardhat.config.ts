import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config"
import "@nomicfoundation/hardhat-toolbox";

import "@nomiclabs/hardhat-etherscan";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.PRIVATE_KEY_ETH,
  },
};


export default config;
