// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {IPoolManager} from "v4-core/interfaces/IPoolManager.sol";
import {IHooks} from "v4-core/interfaces/IHooks.sol";
import {PoolKey} from "v4-core/types/PoolKey.sol";
import {CurrencyLibrary, Currency} from "v4-core/types/Currency.sol";

contract PoolInitialize {
    using CurrencyLibrary for Currency;

    // set the initialize router
    // sepolia ethereum
    IPoolManager manager = IPoolManager(0xf7a031A182aFB3061881156df520FE7912A51617);

    function init(
        address token0,
        address token1,
        uint24 swapFee,
        int24 tickSpacing,
        address hook,
        uint160 sqrtPriceX96,
        bytes calldata hookData
    ) external {
        // sort your tokens! v4 requires token0 < token1
        if (token0 > token1) {
            (token0, token1) = (token1, token0);
        }

        PoolKey memory pool = PoolKey({
            currency0: Currency.wrap(token0),
            currency1: Currency.wrap(token1),
            fee: swapFee,
            tickSpacing: tickSpacing,
            hooks: IHooks(hook)
        });
        manager.initialize(pool, sqrtPriceX96, hookData);
    }
}