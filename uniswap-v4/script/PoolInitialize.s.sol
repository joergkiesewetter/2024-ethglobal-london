// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import { Apecoin } from "../src/Apecoin.sol";
import "../src/ApefulHook.sol";
import "../src/PoolInitialize.sol";

contract PoolInitialize is Script {
    function setUp() public {}

    function run() public {
        
        address deployerPublicKey = vm.envAddress("DEPLOYER_PUBLIC_KEY");
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Apecoin Apecoin = new Apecoin(deployerPublicKey);

        vm.stopBroadcast();
    }
}