// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EnterpriseCrowdsale is Ownable {
    IERC20 public token; // Le contrat ERC-20 à vendre
    uint256 public tokenPrice; // Prix du token en Wei (1 ether = 1e18 wei)
    uint256 public tokensForSale; // Quantité totale de tokens disponibles à la vente
    uint256 public tokensSold; // Quantité de tokens déjà vendus
    uint256 public saleEndTime; // Fin de la levée de fonds (timestamp)

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event TokensReclaimed(uint256 amount);

    modifier saleActive() {
        require(block.timestamp <= saleEndTime, "Sale has ended");
        _;
    }

    modifier onlyAfterSale() {
        require(block.timestamp > saleEndTime, "Sale is still active");
        _;
    }

    constructor(
        address _tokenAddress,
        uint256 _tokenPrice,
        uint256 _tokensForSale,
        uint256 _saleDurationDays
    ) {
        token = IERC20(_tokenAddress);
        tokenPrice = _tokenPrice;
        tokensForSale = _tokensForSale;
        saleEndTime = block.timestamp + (_saleDurationDays * 1 days);
    }

    function purchaseTokens(uint256 tokenAmount) external payable saleActive {
        uint256 cost = tokenAmount * tokenPrice;
        require(msg.value >= cost, "Insufficient funds sent");
        require(tokenAmount <= tokensForSale - tokensSold, "Not enough tokens available");

        // Transférer les tokens à l'acheteur
        token.transfer(msg.sender, tokenAmount);
        tokensSold += tokenAmount;

        // Émettre l'événement d'achat
        emit TokensPurchased(msg.sender, tokenAmount, cost);

        // Retourner tout excédent d'Ether à l'acheteur
        if (msg.value > cost) {
            payable(msg.sender).transfer(msg.value - cost);
        }
    }

    function reclaimUnsoldTokens() external onlyOwner onlyAfterSale {
        uint256 unsoldTokens = tokensForSale - tokensSold;
        require(unsoldTokens > 0, "No unsold tokens to reclaim");

        // Transférer les tokens invendus au propriétaire
        token.transfer(owner(), unsoldTokens);

        // Émettre l'événement de récupération des tokens
        emit TokensReclaimed(unsoldTokens);
    }

    function reclaimEther() external onlyOwner onlyAfterSale {
        // Transférer les ethers collectés au propriétaire
        payable(owner()).transfer(address(this).balance);
    }
}