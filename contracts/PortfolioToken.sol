/*
    Copyright 2020 InvestingSnippets.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    SPDX-License-Identifier: Apache License, Version 2.0
*/

pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";

import { Address } from "@openzeppelin/contracts/utils/Address.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { SignedSafeMath } from "@openzeppelin/contracts/math/SignedSafeMath.sol";

contract PortfolioToken is ERC20 {
    using Address for address;
    using SafeMath for uint256;
    using SignedSafeMath for int256;

    address PortfolioManager;

    struct Asset {
        uint8 weight; // weight in the Portfolio
        uint timeStamp; // last updated
        string name;
        string symbol;
    }

    mapping ( address => Asset ) assets; // this allows to store tokens by their ethereum address
    address[] public allAssets; // a directory of all the token addresses in the fund
    mapping(address => bool) public isResource;

    int256 private strikePrice;

    constructor(
        int256 _strikePrice,
        string memory _name,
        string memory _symbol
    )
        public
        ERC20(_name, _symbol)
    {
        PortfolioManager = msg.sender;
        strikePrice = _strikePrice;
    }

    modifier onlyManager() {
        _validateOnlyManager();
        _;
    }

    function mint(address _account, uint256 _quantity) public {
        _mint(_account, _quantity);
    }

    function addAsset(address _assetAddress, uint8 _weight, string memory _name, string memory _symbol) external onlyManager {
        require(!isResource[_assetAddress], "Asset already exists"); // not adding true/false val in struct to save gas
        assets[_assetAddress].weight = _weight;
        assets[_assetAddress].name = _name;
        assets[_assetAddress].symbol = _symbol;
        assets[_assetAddress].timeStamp = block.timestamp;
        isResource[_assetAddress] = true;
        allAssets.push(_assetAddress);
    }

    function editAsset(address _assetAddress, uint8 _weight) external onlyManager {
        assets[_assetAddress].weight = _weight;
        assets[_assetAddress].timeStamp = block.timestamp;
    }

    function removeAsset(address _assetAddress) external onlyManager {
        delete assets[_assetAddress];
        // allAssets = allAssets.remove(_assetAddress);
        isResource[_assetAddress] = false;
    }

    function getAssets() external view returns(address[] memory) {
        return allAssets;
    }

    function getAssetInfo(address _assetAddress) external view returns(string memory name, string memory symbol, uint8 weight, uint timeStamp) {
        return (assets[_assetAddress].name, assets[_assetAddress].symbol, assets[_assetAddress].weight, assets[_assetAddress].timeStamp);
    } 

    function _validateOnlyManager() internal view {
        require(msg.sender == PortfolioManager, "Only manager has access");
    }
}