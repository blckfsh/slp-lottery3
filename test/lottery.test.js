const SampleToken = artifacts.require('SampleToken')
const Lottery = artifacts.require('Lottery')

require('chai')
	.use(require('chai-as-promised'))
	.should()

contract('Lottery', ([deployer, investor]) => {
  let token, lottery

  before(async () => {
    token = await SampleToken.new('100')
		lottery = await Lottery.new(token.address)
    accounts = await web3.eth.getAccounts()

    // Transfer all tokens to accounts (100 tokens)
  	await token.transfer(accounts[0], '20')
    await token.transfer(accounts[1], '20')
    await token.transfer(accounts[2], '20')
    await token.transfer(accounts[3], '20')
    await token.transfer(accounts[4], '20')
  })

  describe('Token deployment', async () => {
		it('contract has a name', async () => {
			const name = await token.name()
      const symbol = await token.symbol()
			assert.equal(name, 'SampleToken')
      assert.equal(symbol, 'SLP')
		})
	})

  // describe('Lottery deployment', async () => {
	// 	it('contract has a owner', async () => {
	// 		const owner = await lottery.owner()
	// 		assert.equal(owner, accounts[0])
	// 	})
	//
	// 	it('deployer has tokens', async() => {
	// 		let balance = await token.balanceOf(deployer)
	// 		assert.equal(balance.toString(), '20')
	// 	})
	// })

  // describe('pick winner from player pool', async () => {
  //   let result
	//
  //   before( async () => {
	// 		// Player must approve tokens before sending
  //     await token.approve(lottery.address, '20', {from: deployer})
	//
  //     // Choose a winner from the players pool (these are the accounts that participate on the lottery)
  //     result = await lottery.pickWinner(deployer, accounts[1], accounts[2], accounts[3], '70', '20', '10', {from: deployer})
  //   })
	//
  //   it('Allows owner to pick a winner from players pool', async () => {
	//
	// 		//  Check Owner balance
	// 		let ownerBalance
  //     ownerBalance = await token.balanceOf(deployer)
  //     assert.equal(ownerBalance.toString(), '0')
	//
  //     // Check player balance after picking a winner
  //     let playerBalance
  //     playerBalance = await token.balanceOf(accounts[1])
  //     assert.equal(playerBalance.toString(), '34')
	//
	// 		// Check burn balance after picking a winner
  //     let burnBalance
  //     burnBalance = await token.balanceOf(accounts[2])
  //     assert.equal(burnBalance.toString(), '24')
	//
	// 		// Check guild balance after picking a winner
  //     let guildBalance
  //     guildBalance = await token.balanceOf(accounts[3])
  //     assert.equal(guildBalance.toString(), '22')
  //   })
  // })
})
