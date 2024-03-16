const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("ApefulModule", (m: any) => {
  const token = m.contract("Apeful", [
    "0xACB8a1fcC06f1a199C1782414E39BdB4A8238e69",
    "a comic book cover of an ape wearing a medieval crown and rope, sitting on a throne,",
  ]);

  return { token };
});

module.exports = TokenModule;
