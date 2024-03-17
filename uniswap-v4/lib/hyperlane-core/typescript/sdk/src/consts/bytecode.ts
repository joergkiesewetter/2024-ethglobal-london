export enum BytecodeHash {
  V3_MAILBOX_BYTECODE_HASH = '0x6e853444a6e38bb1d7ac7608b92a70cee83153c891c70ed882b2432134bb23a0', // without optimizer
  OPT_V3_MAILBOX_BYTECODE_HASH = '0x7cc944e10fa5597f10265bdac4a808e705711451ee7f117ebf9a97193b796136', // with optimizer
  TRANSPARENT_PROXY_4_9_3_BYTECODE_HASH = '0xae0fb63adc64a29562a3337ed10b8772f89d5241bc3d8f0a82e9462d421e5e4b', // OZ 4.9.3
  TRANSPARENT_PROXY_BYTECODE_HASH = '0x320bda003dfa31828115be5c01b9f3e7eecaf2532afdb89d2b53559f2e7ab86d', // without optimizer
  OPT_TRANSPARENT_PROXY_BYTECODE_HASH = '0x30aa3b1506a94c0fe2749af099851623685d9a24a65e2e8b3746c272499979d1', // with optimizer
  PROXY_ADMIN_BYTECODE_HASH = '0x13855ae57da3aadecb9259cecece16e1f434b8850fe95531f422e4e262f3f200',
  V2_PROXY_ADMIN_BYTECODE_HASH = '0x7c378e9d49408861ca754fe684b9f7d1ea525bddf095ee0463902df701453ba0', // reused from v2
  INTERCHAIN_GAS_PAYMASTER_BYTECODE_HASH = '0xf9c7e93d69bf377a85bce53f6d89a59fc75334d823042014ca32ee6e4d6d8070', // without optimizer
  OPT_INTERCHAIN_GAS_PAYMASTER_BYTECODE_HASH = '0x69325ab0957fcca37e2eac622af6186380f4cddb279183a97c37511459d40f18', // optimized
  OWNER_INITIALIZABLE_INTERCHAIN_GAS_PAYMASTER_BYTECODE_HASH = '0xd2c5b00ac2d058117491d581d63c3c4fcf6aeb2667c6cc0c7caed359c9eebea1',
  OVERHEAD_IGP_BYTECODE_HASH = '0x3cfed1f24f1e9b28a76d5a8c61696a04f7bc474404b823a2fcc210ea52346252',
}