const {ethers} = require("hardhat");

async function main() {
  const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
  const enterpriseToken = await EnterpriseToken.deploy(100000000);
  await enterpriseToken.waitForDeployment();

  console.log("token deployed: ", enterpriseToken.name);

  const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale")
  const crowdsale = await Crowdsale.deploy(
    await enterpriseToken.getAddress(), 
      100,
      1000000,
      7
  )
  await crowdsale.waitForDeployment()
  console.log("crownsale deployed: ", crowdsale.token);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});