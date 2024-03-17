import {
  ChainMap,
  IgpConfig,
  defaultMultisigConfigs,
  multisigIsmVerificationCost,
} from '@hyperlane-xyz/sdk';
import { exclude, objMap } from '@hyperlane-xyz/utils';

import { supportedChainNames } from './chains';
import { storageGasOracleConfig } from './gas-oracle';
import { owners } from './owners';

export const igp: ChainMap<IgpConfig> = objMap(owners, (chain, ownerConfig) => {
  return {
    ...ownerConfig,
    oracleKey: ownerConfig.owner,
    beneficiary: ownerConfig.owner,
    oracleConfig: storageGasOracleConfig[chain],
    overhead: Object.fromEntries(
      exclude(chain, supportedChainNames).map((remote) => [
        remote,
        multisigIsmVerificationCost(
          // TODO: parameterize this
          defaultMultisigConfigs[remote].threshold,
          defaultMultisigConfigs[remote].validators.length,
        ),
      ]),
    ),
  };
});
