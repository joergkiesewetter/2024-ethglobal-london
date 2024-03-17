// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {BaseHook} from "./BaseHook.sol";
import {Hooks} from "v4-core/libraries/Hooks.sol";
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {PoolId, PoolIdLibrary} from "v4-core/types/PoolId.sol";
import {BalanceDelta} from "v4-core/types/BalanceDelta.sol";
import {Currency} from "v4-core/types/Currency.sol";
import {IMailbox} from "hyperlane-core/solidity/contracts/interfaces/IMailbox.sol";

contract ApefulHook is BaseHook {
    using PoolIdLibrary for PoolKey;

    mapping(address user => bool allowed) public allowedUsers;

    IMailbox public hyperlaneMailbox;
    Currency public apeCoinCurrency;
    bytes32 public apefulRemoteAddress;

    constructor(IPoolManager _poolManager, address _hyperlaneMailbox, address _apeCoinAddress, address _apefulRemoteAddress) BaseHook(_poolManager) {
        hyperlaneMailbox = IMailbox(_hyperlaneMailbox);
        apeCoinCurrency = Currency.wrap(_apeCoinAddress);
        apefulRemoteAddress = bytes32(uint256(uint160(_apefulRemoteAddress)));
    }

    function beforeSwap(address, PoolKey calldata key, IPoolManager.SwapParams calldata params, bytes calldata hookData)
        external
        override
        returns (bytes4)
    {
        // --- Read the user's address --- //
        address user = abi.decode(hookData, (address));

        bool giveRewards = false;

        // zeroForOne and token1 == apecoin
        if (params.zeroForOne && key.currency1 == apeCoinCurrency) {
            giveRewards = true;
        } else if (!params.zeroForOne && key.currency0 == apeCoinCurrency) {
            giveRewards = true;
        }

        if (giveRewards) {
            string memory message = "";

            if (params.amountSpecified == 1e18) {
                message = " with a dirty sewer background";
            } else if (params.amountSpecified == 1337e18) {
                message = " with a cool cyberpunk background";
            } else if (params.amountSpecified >= 50000e18) {
                message = " with a golden background";
            } else if (params.amountSpecified >= 5000e18) {
                message = " with a silver background";
            } else if (params.amountSpecified >= 500e18) {
                message = " with a bronze background";
            }

            hyperlaneMailbox.dispatch(
                696969, 
                apefulRemoteAddress, 
                abi.encode(user, message));
        }

        return this.beforeSwap.selector;
    }

    // Helper function for demonstration
    function setAllowedUser(address user, bool allowed) external {
        allowedUsers[user] = allowed;
    }

    function getHookPermissions() public pure override returns (Hooks.Permissions memory) {
        return Hooks.Permissions({
            beforeInitialize: false,
            afterInitialize: false,
            beforeAddLiquidity: false,
            afterAddLiquidity: false,
            beforeRemoveLiquidity: false,
            afterRemoveLiquidity: false,
            beforeSwap: true,
            afterSwap: false,
            beforeDonate: false,
            afterDonate: false
        });
    }
}
