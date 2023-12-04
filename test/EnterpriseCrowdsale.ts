import { expect } from "chai";
import { ethers } from "hardhat";

describe("EnterpriseCrowdsale", function () {
    it("should allow purchasing tokens", async function () {
        const [owner, otherAccount] = await ethers.getSigners();

        const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
        const enterpriseToken = await EnterpriseToken.deploy(100000);
        await enterpriseToken.waitForDeployment();

        const EnterpriseCrowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
        const enterpriseCrowdsale = await EnterpriseCrowdsale.deploy(
        await enterpriseToken.getAddress(),
        1,
        100,
        10000 
        );
        
        await enterpriseToken.transfer(await enterpriseCrowdsale.getAddress(), 100);

        await owner.sendTransaction({ to: otherAccount.address, value: ethers.parseEther("1000") });
        await enterpriseCrowdsale.connect(otherAccount).purchaseTokens(1, { value: ethers.parseEther("2") });
        const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);

        expect(buyerBalance).to.equal(1);
    });
});
