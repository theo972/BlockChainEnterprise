import { expect } from "chai";
import { ethers } from "hardhat";

describe("Crowdsale", function () {
  describe("EntrepriseCrowdsale", function () {
    it("should allow purchasing tokens", async function () {
      const [owner, otherAccount] = await ethers.getSigners();

      const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
      const enterpriseToken = await EnterpriseToken.deploy(100);
      await enterpriseToken.waitForDeployment();

      const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
      const crowdsale = await Crowdsale.deploy(
        await enterpriseToken.getAddress(),
        1, // Replace with the actual token price
        100, // Replace with the actual number of tokens for sale
        10000
      );

      await owner.sendTransaction({ to: await crowdsale.getAddress(), value: ethers.parseEther("10") });

      await crowdsale.purchaseTokens(10);

      const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);
      expect(buyerBalance).to.equal(10);
    });
  });
});
