import { ethers } from "hardhat";

async function main() {
  const MyToken = await ethers.getContractFactory("EnterpriseToken");
  const myToken = await MyToken.deploy(100000000);
  await myToken.deploymentTransaction();

  console.log("Ocean token deployed: ", myToken.getAddress());
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});