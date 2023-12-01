import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying EnterpriseToken with the account:", deployer.address);

  const initialSupply = 1000000; // Ajustez l'approvisionnement initial selon vos besoins

  // Déployez le contrat ERC-20
  const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
  const enterpriseToken = await EnterpriseToken.deploy(1);
  
  console.log("EnterpriseToken deployed to:", enterpriseToken.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });