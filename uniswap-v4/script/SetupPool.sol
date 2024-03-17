// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import "../src/Apecoin.sol";
import "../src/ApefulHook.sol";
import "../src/PoolInitialize.sol";
import "../src/USDC.sol";

contract SetupPool is Script {
    function setUp() public {}

    function run() public {
        
        address deployerPublicKey = vm.envAddress("DEPLOYER_PUBLIC_KEY");
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        IPoolManager poolManager = IPoolManager(vm.envAddress("SEPOLIA_POOL_MANAGER"));
        address hyperlaneMailboxAddress = vm.envAddress("SEPOLIA_HYPERLANE_MAILBOX");
        address apefulRemoteAddress = vm.envAddress("GALADRIEL_APEFUL_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        ApeCoin apeCoin = new ApeCoin(deployerPublicKey);
        USDC usdc = new USDC(deployerPublicKey);

        ApefulHook hook = new ApefulHook(poolManager, hyperlaneMailboxAddress, address(apeCoin));

        PoolInitialize poolInitialize = new PoolInitialize();

        bytes memory hookData = new bytes(0);

        poolInitialize.init(
            address(apeCoin),
            address(usdc),
            500,
            60,
            address(hook),
            1909968240759429201598133539,
            ""
        );

        vm.stopBroadcast();
    }
}