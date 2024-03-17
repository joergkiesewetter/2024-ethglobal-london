import { RpcConsensusType } from '@hyperlane-xyz/sdk';

import { HelloWorldConfig } from '../../../src/config';
import { HelloWorldKathyRunMode } from '../../../src/config/helloworld/types';
import { Contexts } from '../../contexts';

import { environment } from './chains';
import hyperlaneAddresses from './helloworld/hyperlane/addresses.json';
import rcAddresses from './helloworld/rc/addresses.json';

export const hyperlaneHelloworld: HelloWorldConfig = {
  addresses: hyperlaneAddresses,
  kathy: {
    docker: {
      repo: 'gcr.io/abacus-labs-dev/hyperlane-monorepo',
      tag: '7d1f975-20240312-113049',
    },
    chainsToSkip: [],
    runEnv: environment,
    namespace: environment,
    runConfig: {
      mode: HelloWorldKathyRunMode.Service,
      fullCycleTime: 1000 * 60 * 60 * 24 * 6, // every 6 days. At 12 chains it 12 * 11 messages = 132 messages its a bit less than once an hour
    },
    messageSendTimeout: 1000 * 60 * 10, // 10 min
    messageReceiptTimeout: 1000 * 60 * 20, // 20 min
    connectionType: RpcConsensusType.Fallback,
  },
};

export const releaseCandidateHelloworld: HelloWorldConfig = {
  addresses: rcAddresses,
  kathy: {
    docker: {
      repo: 'gcr.io/abacus-labs-dev/hyperlane-monorepo',
      tag: '7d1f975-20240312-113049',
    },
    chainsToSkip: [],
    runEnv: environment,
    namespace: environment,
    runConfig: {
      mode: HelloWorldKathyRunMode.CycleOnce,
    },
    messageSendTimeout: 1000 * 60 * 8, // 8 min
    messageReceiptTimeout: 1000 * 60 * 20, // 20 min
    connectionType: RpcConsensusType.Fallback,
  },
};

export const helloWorld = {
  [Contexts.Hyperlane]: hyperlaneHelloworld,
  [Contexts.ReleaseCandidate]: releaseCandidateHelloworld,
};
