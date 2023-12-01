import { ethers } from "hardhat";

async function main() {
  const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
  const enterpriseToken = await EnterpriseToken.deploy(100000000);
  await enterpriseToken.waitForDeployment();

  console.log("token deployed: ", enterpriseToken.name);

  const Crownsale = await ethers.getContractFactory("Crownsale")
  const crownsale = await Crownsale.deploy(
    await enterpriseToken.getAddress(), 
      100,
      1000000,
      7
  )
  await crownsale.waitForDeployment()
  console.log("crownsale deployed: ", crownsale.token);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});