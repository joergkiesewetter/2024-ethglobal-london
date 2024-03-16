const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("ApefulModule", (m) => {
  const token = m.contract("Apeful");

  return { token };
});

module.exports = TokenModule;