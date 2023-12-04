import { expect } from "chai";
import { ethers } from "hardhat";

describe("EnterpriseCrowdsale", function () {
  it("should allow purchasing tokens", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
    const enterpriseToken = await EnterpriseToken.deploy(100000000);
    await enterpriseToken.waitForDeployment();

    const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
    const crowdsale = await Crowdsale.deploy(
      await enterpriseToken.getAddress(),
      1, 
      100,
      7
    );

    await owner.sendTransaction({ to: crowdsale, value: ethers.parseEther("10") });

    await crowdsale.connect(otherAccount).purchaseTokens(10);

    const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);
    expect(buyerBalance).to.equal(10);
  });

  it("should allow the owner to reclaim unsold tokens", async function () {
    const [owner] = await ethers.getSigners();

    const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
    const enterpriseToken = await EnterpriseToken.deploy(100000000);
    await enterpriseToken.waitForDeployment();

    const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
    const crowdsale = await Crowdsale.deploy(
      await enterpriseToken.getAddress(),
      1, 
      100, 
      7
    );

    await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 

    await crowdsale.reclaimUnsoldTokens();

    const ownerBalance = await enterpriseToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(100);
  });

  it("should allow the owner to reclaim Ether", async function () {
    const [owner] = await ethers.getSigners();

    const EnterpriseToken = await ethers.getContractFactory("EnterpriseToken");
    const enterpriseToken = await EnterpriseToken.deploy(100000000);
    await enterpriseToken.waitForDeployment();

    const Crowdsale = await ethers.getContractFactory("EnterpriseCrowdsale");
    const crowdsale = await Crowdsale.deploy(
      await enterpriseToken.getAddress(),
      1, 
      100, 
      7
    );

    await owner.sendTransaction({ to: crowdsale, value: ethers.parseEther("10") });

    await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]); 

    await crowdsale.reclaimEther();

    const ownerBalance = await ethers.provider.getBalance(owner.address);
    expect(ownerBalance).to.be.above(0);
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

    await ethers.provider.send("evm_increaseTime", [5000]);
    await ethers.provider.send("evm_mine", []);

    await crowdsale.connect(otherAccount).purchaseTokens(10);

    const buyerBalance = await enterpriseToken.balanceOf(otherAccount.address);
    expect(buyerBalance).to.equal(10);
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
      10000
    );

    await ethers.provider.send("evm_increaseTime", [10000]);
    await ethers.provider.send("evm_mine", []);

    await expect(
      crowdsale.connect(otherAccount).purchaseTokens(5)
    ).to.be.revertedWith("Sale has ended");
  });

});
