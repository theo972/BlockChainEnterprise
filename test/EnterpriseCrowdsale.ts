import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

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
        await enterpriseCrowdsale.connect(otherAccount).purchaseTokens({ value: 2 });
        const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);

        expect(buyerBalance).to.equal(2);
    });

    it("should not allow purchasing tokens if not enough tokens available", async function () {
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
    
        await enterpriseToken.transfer(await enterpriseCrowdsale.getAddress(), 200); 
   
        await owner.sendTransaction({ to: otherAccount.address, value: ethers.parseEther("1000") });

        await expect(
            enterpriseCrowdsale.connect(otherAccount).purchaseTokens({ value: 200 })
        ).to.be.revertedWith('Not enough tokens available');   

        const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);
        expect(buyerBalance).to.equal(0);
    });

    it("should allow purchasing tokens during the active sale", async function () {
        const [owner, otherAccount] = await ethers.getSigners();
        const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
        const enterpriseToken = await EnterpriseToken.deploy(100);
        await enterpriseToken.waitForDeployment();
    
        const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
        const crowdsale = await Crowdsale.deploy(
          await enterpriseToken.getAddress(),
          1,
          100,
          10000
        );
    
        await time.increase(5000);
    
        await enterpriseToken.transfer(await crowdsale.getAddress(), 100);

        await owner.sendTransaction({ to: otherAccount.address, value: ethers.parseEther("1000") });
        await crowdsale.connect(otherAccount).purchaseTokens({ value: 100 });
    
        const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);
        expect(buyerBalance).to.equal(100);
      });
    
      it("should not allow purchasing tokens after the sale has ended", async function () {
        const [owner, otherAccount] = await ethers.getSigners();
        const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
        const enterpriseToken = await EnterpriseToken.deploy(100);
        await enterpriseToken.waitForDeployment();
    
        const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
        const crowdsale = await Crowdsale.deploy(
          await enterpriseToken.getAddress(),
          1,
          100,
          1
        );
        await enterpriseToken.transfer(await crowdsale.getAddress(), 100);
        await time.increase(100000);
    
        await expect(
          crowdsale.connect(otherAccount).purchaseTokens({ value: 100 })
        ).to.be.revertedWith("Sale has ended");
    });
});
