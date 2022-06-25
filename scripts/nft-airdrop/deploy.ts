import { randomBytes } from "crypto";
import { Wallet } from "ethers";
import { ethers, run } from "hardhat";
import keccak256 from "keccak256";
import MerkleTree from "merkletreejs";

async function main() {
  console.log("Start deploying...");
  const [signer] = await ethers.getSigners();
  const PunksNFT = await ethers.getContractFactory("PunksNFT");
  const Airdrop = await ethers.getContractFactory("Airdrop");

  console.log("PunksNFT deploy...");
  const token = await PunksNFT.deploy();
  await token.deployed();

  console.log("NFT deployed to:", token.address);

  const randomAddresses = new Array(15)
    .fill(0)
    .map(() => new Wallet(randomBytes(32).toString("hex")).address);

  const merkleTree = new MerkleTree(
    randomAddresses.concat(signer.address),
    keccak256,
    { hashLeaves: true, sortPairs: true }
  );

  const root = merkleTree.getHexRoot();

  const airdrop = await Airdrop.deploy(token.address, root);
  await airdrop.deployed();

  console.log("Airdrop deployed to:", airdrop.address);

  await (
    await token.grantRole(await token.MINTER_ROLE(), airdrop.address)
  ).wait();

  const proof = merkleTree.getHexProof(keccak256(signer.address));

  console.log("Proof for Сlaim:", proof);

  await run("verify:verify", {
    address: token.address,
    contract: "contracts/PunksNFT.sol:PunksNFT",
  });

  await run("verify:verify", {
    address: airdrop.address,
    contract: "contracts/Airdrop.sol:Airdrop",
    constructorArguments: [token.address, root],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
