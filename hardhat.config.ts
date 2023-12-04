import { HardhatUserConfig, task } from "hardhat/config";
import "dotenv/config"
import "@nomicfoundation/hardhat-toolbox";

task("deploy", "deploy contract")
  .addParam("price", "The token price")
  .addParam("numberOfToken", "The number of token deploy")
  .addParam("durationInDay", "The duration of the token seling")
  .setAction(async (taskArgs) => {
    const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
    const enterpriseToken = await EnterpriseToken.deploy(taskArgs.numberOfToken);
    await enterpriseToken.waitForDeployment();
  
    console.log("token deployed: ", enterpriseToken.name);
    console.log()
    const tokenAddress = await enterpriseToken.getAddress()
    const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale")
    const crowdsale = await Crowdsale.deploy(
        tokenAddress, 
        ethers.parseEther(taskArgs.price),
        taskArgs.numberOfToken,
        taskArgs.durationInDay
    )
    await enterpriseToken.transfer(await crowdsale.getAddress(), 50);
    await crowdsale.waitForDeployment()
    console.log("crownsale deployed: ", crowdsale.token);
  });

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.PRIVATE_KEY_ETH
  },
  
};



export default config;
