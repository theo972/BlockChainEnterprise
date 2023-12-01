// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnterpriseToken is ERC20, Ownable {
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);

    uint256 public tokenPrice; // Prix du token en wei (1 ether = 1e18 wei)

    // Modifiez le constructeur pour prendre en compte l'adresse initiale du propriétaire
    constructor(uint256 initialSupply, uint256 initialTokenPrice, address initialOwner) ERC20("TheoAnthoAlex", "TAA") Ownable(initialOwner) {
        _mint(initialOwner, initialSupply);
        tokenPrice = initialTokenPrice;
    }

    function setTokenPrice(uint256 newTokenPrice) external onlyOwner {
        tokenPrice = newTokenPrice;
    }

    function purchaseTokens(uint256 tokenAmount) external payable {
        uint256 cost = tokenAmount * tokenPrice;

        require(msg.value >= cost, "Insufficient funds sent");

        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, tokenAmount, cost);

        if (msg.value > cost) {
            // Return excess funds to the buyer
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    // Function to withdraw Ether from the contract (onlyOwner)
    function withdrawEther() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
