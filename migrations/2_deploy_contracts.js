const SampleToken = artifacts.require("SampleToken");

module.exports = async function(deployer) {

  // Deploy Token
  await deployer.deploy(SampleToken);
  const token = await SampleToken.deployed();

  // Get Accounts
  // const account_1 = '0xD7fbAb057cEA4b623Fcf710cCD923A4C2Ee45e60';
  // const account_2 = '0x609d94bab987845c0CeAA538f7b881583F4e8561';
  // const account_3 = '0xF05ecAC4c5Dc86d52F80CB8674533D6D6D631A38';

  // Transfer tokens to accounts
  // await token.transfer(account_1, '20000000000000000000')
  // await token.transfer(account_2, '20000000000000000000')
  // await token.transfer(account_3, '20000000000000000000')
}
