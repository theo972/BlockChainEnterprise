import { HardhatUserConfig } from "hardhat/config";
import "dotenv/config"

//
const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
