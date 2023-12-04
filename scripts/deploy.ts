const {ethers} = require("hardhat");

async function main() {
  const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
  const enterpriseToken = await EnterpriseToken.deploy(100);
  await enterpriseToken.waitForDeployment();

  console.log("token deployed: ", enterpriseToken.name);

  const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale")
  const crowdsale = await Crowdsale.deploy(
    await enterpriseToken.getAddress(), 
      ethers.parseEther("0.1000"),
      50,
      7
  )
  await enterpriseToken.transfer(await crowdsale.getAddress(), 50);
  await crowdsale.waitForDeployment()
  console.log("crownsale deployed: ", crowdsale.token);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});