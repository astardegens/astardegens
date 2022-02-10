const { expect, assert } = require("chai");
const BigNumber = require('bignumber.js');


describe("AstarDegens contract", function () {
  let owner;
  let bob;
  let charlie;
  let addrs;
  const FREE_ADDRESS = '0x0000000000000000000000000000000000000000'
  let ad;



  beforeEach(async function () {
    [owner, bob, charlie, ...addrs] = await ethers.getSigners();
    const AstarDegens = await ethers.getContractFactory("AstarDegens");
    ad = await AstarDegens.deploy("AstarDegens", "AD", "uri", "revUri");
    await ad.deployed();
  });

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

  it("Owner and Bob mint", async () => {
    await ad.pause(false);
    const degenCost = await ad.cost();
    let tokenId = await ad.totalSupply();
    expect(await ad.totalSupply()).to.equal(0);
    expect(
      await ad.mint(1, {
        value: degenCost,
      })
    )
      .to.emit(ad, "Transfer")
      .withArgs(ethers.constants.AddressZero, owner.address, tokenId + 1);

    expect(await ad.totalSupply()).to.equal(1);
    tokenId = await ad.totalSupply();
    expect(
      await ad.connect(bob).mint(1, {
        value: degenCost,
      })
    )
      .to.emit(ad, "Transfer")
      .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));

    expect(await ad.totalSupply()).to.equal(2);
  });

  it("Bob mints 1 token", async () => {
    await ad.pause(false);
    const degenCost = await ad.cost();
    const tokenId = await ad.totalSupply();

    expect(
      await ad.connect(bob).mint(1, {
        value: degenCost,
      })
    )
      .to.emit(ad, "Transfer")
      .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('1'));

    expect(await ad.totalSupply()).to.equal(1);

  });

  it("Bob mints 5", async () => {
    await ad.pause(false);
    let costFor5 = ethers.utils.parseUnits('5', 0)
    costFor5 = costFor5.mul(ethers.constants.WeiPerEther);
    const tokenId = await ad.totalSupply();

    expect(
      await ad.connect(bob).mint(5, {
        value: costFor5,
      })
    )
      .to.emit(ad, "Transfer")
      .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('5'));
    expect(await ad.totalSupply()).to.equal(5);

  });

  it("Bob fails to mints 6", async () => {
    await ad.pause(false);
    let costFor6 = ethers.utils.parseUnits('6', 0)
    costFor6 = costFor6.mul(ethers.constants.WeiPerEther);
    const tokenId = await ad.totalSupply();

    expect(ad.connect(bob).mint(6, { value: costFor6, }))
      .to.revertedWith("Degen tribe is max 5 apes");
  });

  it("Bob fails to mints 5 plus 1", async () => {
    await ad.pause(false);
    let costFor5 = ethers.utils.parseUnits('5', 0)
    costFor5 = costFor5.mul(ethers.constants.WeiPerEther);
    const tokenId = await ad.totalSupply();

    expect(
      await ad.connect(bob).mint(5, {
        value: costFor5,
      })
    )
      .to.emit(ad, "Transfer")
      .withArgs(ethers.constants.AddressZero, bob.address, tokenId.add('5'));
    expect(await ad.totalSupply()).to.equal(5);

    // should fail to mint additional one in new mint call
    const degenCost = await ad.cost();
    expect(ad.connect(bob).mint(1, { value: degenCost }))
      .to.revertedWith("Your Degen tribe is already 5 strong");

    expect(await ad.totalSupply()).to.equal(5);
  });

});