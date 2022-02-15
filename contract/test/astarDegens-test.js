const { expect, assert } = require("chai");
const BigNumber = require('ethers').BigNumber;
const provider = waffle.provider;


describe("AstarDegens contract", function () {
  let owner;
  let bob;
  let charlie;
  let addrs;
  let ad;

  const not_revealed_uri = "not_revealed_uri";

  beforeEach(async function () {
    [owner, bob, charlie, ...addrs] = await ethers.getSigners();
    const AstarDegens = await ethers.getContractFactory("AstarDegens");

    ad = await AstarDegens.deploy("AstarDegens", "AD", not_revealed_uri);
    await ad.deployed();

    // Ensure contract is paused/disabled on deployment
    expect(await ad.isPaused()).to.equal(true);
    expect(await ad.isRevealed()).to.equal(false);
    await ad.pause(false);
  });

  describe("Basic checks", function () {

    it('check the owner', async function () {
      expect(await ad.owner()).to.equal(owner.address)
    });

    it('check the maxSupply', async function () {
      expect(await ad.maxSupply()).to.equal(10000);
    });

    it("Confirm degen price", async function () {
      cost = ethers.utils.parseUnits('1', 0)
      const expectedCost = cost.mul(ethers.constants.WeiPerEther);
      expect(await ad.cost()).to.equal(expectedCost);
    });

  });

  describe("Minting checks", function () {

    it("Non-owner cannot mint without enough balance", async () => {
      const degenCost = await ad.cost();
      await expect(ad.connect(bob).mint({ value: degenCost.sub(1) })).to.be.reverted;

      await expect(ad.connect(bob).mint_many(2, {value: degenCost.mul(2).sub(1) })).to.be.reverted;
    });

    it("Owner can mint without enough balance or for free", async () => {
      const degenCost = await ad.cost();
      expect(await ad.mint({ value: degenCost.sub(1) })).to.be.ok;
      expect(await ad.mint({ value: 0 })).to.be.ok;

      expect(await ad.mint_many(10, { value: 0 })).to.be.ok;
    });

    it("Owner and Bob mint", async () => {
      const degenCost = await ad.cost();
      let tokenId = await ad.totalSupply();
      expect(await ad.totalSupply()).to.equal(0);
      expect(
        await ad.mint({
          value: degenCost,
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, owner.address, tokenId + 1);

      expect(await ad.totalSupply()).to.equal(1);
      tokenId = await ad.totalSupply();
      expect(
        await ad.connect(bob).mint({
          value: degenCost,
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));

      expect(await ad.totalSupply()).to.equal(2);
    });

    it("Minting tokens increased contract balance", async () => {
      const degenCost = await ad.cost();
      const tokenId = await ad.totalSupply();

      // Mint first token and expect a balance increase
      const init_contract_balance = await provider.getBalance(ad.address);
      expect(await ad.mint({ value: degenCost })).to.be.ok;
      expect(await provider.getBalance(ad.address)).to.equal(degenCost);

      // Mint two additonal tokens and expect increase again
      expect(await ad.mint_many(2, { value: degenCost.mul(2) })).to.be.ok;
      expect(await provider.getBalance(ad.address)).to.equal(degenCost.mul(3));
    });

    it("Bob mints 5", async () => {
      const degenCost = await ad.cost();
      const tokenId = await ad.totalSupply();

      expect(
        await ad.connect(bob).mint_many(5, {
          value: degenCost.mul(5),
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('5'));
      expect(await ad.totalSupply()).to.equal(5);

    });

    it("Bob mints 1 plus 4", async () => {
      const degenCost = await ad.cost();
      const tokenId = await ad.totalSupply();

      expect(
        await ad.connect(bob).mint({
          value: degenCost.mul(1),
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));
      expect(await ad.totalSupply()).to.equal(1);

      expect(
        await ad.connect(bob).mint_many(4, {
          value: degenCost.mul(4),
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('4'));
      expect(await ad.totalSupply()).to.equal(5);

    });

    it("Bob fails to mints 6", async () => {
      const degenCost = await ad.cost();
      const tokenId = await ad.totalSupply();

      await expect(ad.connect(bob).mint_many(6, { value: degenCost.mul(6), }))
        .to.revertedWith("Your Degen tribe can't be over 5 strong");
    });

    it("Bob fails to mints 5 plus 1", async () => {
      const degenCost = await ad.cost();
      const tokenId = await ad.totalSupply();

      expect(
        await ad.connect(bob).mint_many(5, {
          value: degenCost.mul(5),
        })
      )
        .to.emit(ad, "Transfer")
        .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('5'));
      expect(await ad.totalSupply()).to.equal(5);

      // should fail to mint additional one in new mint call
      await expect(ad.connect(bob).mint({ value: degenCost }))
        .to.revertedWith("Your Degen tribe can't be over 5 strong");

      expect(await ad.totalSupply()).to.equal(5);
    });

    it("Cannot mint past max supply", async () => {
      const degenCost = await ad.cost();
      const maxSupply = 20;
      await ad.setMaxSupply(maxSupply);

      expect(await ad.mint_many(maxSupply, { value: degenCost.mul(maxSupply) })).to.be.ok;

      await expect(ad.mint({ value: degenCost }))
        .to.revertedWith("End of supply");
      
    });

  });

  describe("URI checks", function () {

    it("Token URI not available for non-minted token", async function () {
      await expect(ad.tokenURI(1)).to.be.reverted;
    });

    it("URI not visible before reveal", async function () {
      const degenCost = await ad.cost();
      expect(await ad.mint({ value: degenCost })).to.be.ok;
      expect(await ad.tokenURI(1)).to.equal(not_revealed_uri);
    });

    it("URI visible after reveal", async function () {
      expect(ad.reveal()).to.be.ok;

      const degenCost = await ad.cost();
      expect(await ad.mint_many(5, { value: degenCost.mul(5) })).to.be.ok;

      const baseUri = "baseUri/";
      const baseExtension = ".ext";

      expect(await ad.setBaseURI(baseUri)).to.be.ok;
      expect(await ad.setBaseExtension(baseExtension)).to.be.ok;

      const index = 3;
      expect(await ad.tokenURI(3)).to.equal(baseUri + index.toString() + baseExtension);
    });


  });

  describe("Wallet checks", function () {

    it("Wallets for owner and Bob are as expected", async () => {
      expect(await ad.walletOfOwner(owner.address)).to.be.empty;

      const degenCost = await ad.cost();

      const ownerFirstCount = 2;
      const bobFirstCount = 1;
      const ownerSecondCount = 3;

      expect(await ad.mint_many(ownerFirstCount, { value: degenCost })).to.be.ok;
      const ownerFirstWallet = await ad.walletOfOwner(owner.address);
      expect(ownerFirstWallet).to.have.lengthOf(ownerFirstCount);
      expect(ownerFirstWallet[0]).to.equal(1);
      expect(ownerFirstWallet[1]).to.equal(2);

      expect(await ad.connect(bob).mint_many(bobFirstCount, { value: degenCost })).to.be.ok;
      const bobFirstWallet = await ad.walletOfOwner(bob.address);
      expect(bobFirstWallet).to.have.lengthOf(bobFirstCount);
      expect(bobFirstWallet[0]).to.equal(3);

      expect(await ad.mint_many(ownerSecondCount, { value: degenCost })).to.be.ok;
      const ownerSecondWallet = await ad.walletOfOwner(owner.address);
      expect(ownerSecondWallet).to.have.lengthOf(ownerFirstCount + ownerSecondCount);
      expect(ownerSecondWallet[0]).to.equal(1);
      expect(ownerSecondWallet[1]).to.equal(2);
      expect(ownerSecondWallet[2]).to.equal(4);
      expect(ownerSecondWallet[3]).to.equal(5);
      expect(ownerSecondWallet[4]).to.equal(6);
    });

  });

  describe("Payout checks", function () {
    it("Withdraw earnings", async () => {
      const degenCost = await ad.cost();

      expect(await ad.mint_many(3, { value: degenCost.mul(3) })).to.be.ok;
      expect(await ad.connect(bob).mint_many(4, { value: degenCost.mul(4) })).to.be.ok;
      expect(await ad.connect(charlie).mint_many(5, { value: degenCost.mul(5) })).to.be.ok;

      // Prepare addresses for payout
      const daoAddress = '0xd89e71eB662512FB702807549C6744Bb6aB35069';
      const teamAddress = '0xe8FE23F0e4b11646BB26870eF5CbabBCDc7bd12E';

      // Prepare expected payouts
      const initContractBalance = await provider.getBalance(ad.address);
      const daoPart = initContractBalance.mul(70).div(100);
      const teamPart = initContractBalance.mul(28).div(100);
      const devPart = initContractBalance.sub(daoPart).sub(teamPart);
      // sanity check
      expect(daoPart.add(teamPart).add(devPart)).to.equal(initContractBalance);

      const initOwnerBalance = await provider.getBalance(owner.address);

      // Ensure that addresses don't have any initial balance
      expect(await provider.getBalance(daoAddress)).to.equal(0);
      expect(await provider.getBalance(teamAddress)).to.equal(0);

      // Withdraw and distribute balance
      expect(await ad.connect(bob).withdraw()).to.be.ok;

      // Ensure that distribution was as expected
      expect(await provider.getBalance(daoAddress)).to.equal(daoPart);
      expect(await provider.getBalance(teamAddress)).to.equal(teamPart);
      expect(await provider.getBalance(owner.address)).to.equal(initOwnerBalance.add(devPart));
    });
  });

});