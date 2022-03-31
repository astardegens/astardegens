const { expect, assert } = require("chai");
const BigNumber = require('ethers').BigNumber;
const provider = waffle.provider;


describe("ShidenPass contract", function () {
  let owner;
  let bob;
  let charlie;
  let addrs;
  let contract;

  const not_revealed_uri = "not_revealed_uri";

  beforeEach(async function () {
    [owner, bob, charlie, ...addrs] = await ethers.getSigners();
    const ShidenPass = await ethers.getContractFactory("ShidenPass");
    contract = await ShidenPass.deploy("ShidenPass", "SHPASS", not_revealed_uri);
    await contract.deployed();

    // Ensure contract is paused/disabled on deployment
    expect(await contract.is_paused()).to.equal(true);
    expect(await contract.is_revealed()).to.equal(true);
    await contract.pause(false);
  });

  describe("Basic checks", function () {

    it('check the owner', async function () {
      expect(await contract.owner()).to.equal(owner.address)
    });

    it('check the maxSupply', async function () {
      expect(await contract.maxSupply()).to.equal(5000);
    });

    it("Confirm token price", async function () {
      cost = ethers.utils.parseUnits('1', 0)
      const expectedCost = cost.mul(ethers.constants.WeiPerEther);
      expect(await contract.cost()).to.equal(expectedCost);
    });

  });

  describe("Minting checks", function () {

    it("Non-owner cannot mint without enough balance", async () => {
      const tokenCost = await contract.cost();
      await expect(contract.connect(bob).mint(1, { value: tokenCost.sub(1) })).to.be.reverted;
    });

    it("Owner cant mint without enough balance or for free", async () => {
      const tokenCost = await contract.cost();
      expect(await contract.mint(1, { value: tokenCost.sub(1) })).to.be.ok;
      expect(await contract.mint(1, { value: 0 })).to.be.ok;
    });

    it("Owner and Bob mint", async () => {
      const tokenCost = await contract.cost();
      let tokenId = await contract.totalSupply();
      expect(await contract.totalSupply()).to.equal(0);
      expect(
        await contract.mint(1, {
          value: tokenCost,
        })
      )
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, tokenId + 1);

      expect(await contract.totalSupply()).to.equal(1);
      tokenId = await contract.totalSupply();
      expect(
        await contract.connect(bob).mint(1, {
          value: tokenCost,
        })
      )
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));

      expect(await contract.totalSupply()).to.equal(2);
    });

    it("Minting tokens increased contract balance", async () => {
      const tokenCost = await contract.cost();
      const tokenId = await contract.totalSupply();

      // Mint first token and expect a balance increase
      const init_contract_balance = await provider.getBalance(contract.address);
      expect(await contract.mint(1, { value: tokenCost })).to.be.ok;
      expect(await provider.getBalance(contract.address)).to.equal(tokenCost);

      // Mint additonal token and expect increase again
      expect(
        await contract.connect(bob).mint(1, {
          value: tokenCost,
        })
      )
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('2'));
      expect(await contract.totalSupply()).to.equal(2);
    });

    // });

    it("Bob fails to mints 2", async () => {
      const tokenCost = await contract.cost();
      const tokenId = await contract.totalSupply();

      await expect(contract.connect(bob).mint(2, { value: tokenCost.mul(2), }))
        .to.revertedWith("Max mint is exceeded");
    });

    it("Bob fails to mints 1 plus 1", async () => {
      const tokenCost = await contract.cost();
      const tokenId = await contract.totalSupply();

      expect(
        await contract.connect(bob).mint(1, {
          value: tokenCost.mul(1),
        })
      )
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));
      expect(await contract.totalSupply()).to.equal(1);

      // should fail to mint additional one in new mint call
      await expect(contract.connect(bob).mint(1, { value: tokenCost }))
        .to.be.revertedWith("You have already minted");

      expect(await contract.totalSupply()).to.equal(1);
    });


    // it("Bob fails to mints 2 with funds for 1", async () => {
    //   const tokenCost = await contract.cost();

    //   await expect(contract.connect(bob).mint(2, { value: tokenCost }))
    //     .to.revertedWith("Not enough funds for mint");

    //   expect(await contract.totalSupply()).to.equal(0);
    // });

  });

  describe("URI checks", function () {

    it("URI visible after reveal", async function () {
      expect(contract.reveal()).to.be.ok;

      const tokenCost = await contract.cost();
      expect(await contract.mint(1, { value: tokenCost.mul(1) })).to.be.ok;

      const baseUri = "baseUri/";
      const baseExtension = ".ext";

      expect(await contract.setBaseURI(baseUri)).to.be.ok;
      expect(await contract.setBaseExtension(baseExtension)).to.be.ok;

      const index = 1;
      expect(await contract.tokenURI(1)).to.equal(baseUri + index.toString() + baseExtension);
    });


  });



  describe("Payout checks", function () {
    it("Withdraw earnings", async () => {
      const tokenCost = await contract.cost();

      expect(await contract.mint(1, { value: tokenCost })).to.be.ok;
      expect(await contract.connect(bob).mint(1, { value: tokenCost })).to.be.ok;
      expect(await contract.connect(charlie).mint(1, { value: tokenCost })).to.be.ok;

      const initOwnerBalance = await provider.getBalance(owner.address);

      // Withdraw balance
      expect(await contract.connect(bob).withdraw()).to.be.ok;

      // Ensure that payout was as expected
      expect(await provider.getBalance(owner.address)).to.equal(initOwnerBalance.add(tokenCost.mul(3)));
    });
  });

});