const { ethers, run } = require("hardhat");

const DEPLOY_OPTIONS = {
  mumbai: {
    link: "0x326c977e6efc84e512bb9c30f76e30c160ed06fb",
    vrfCoordinator: "0x7a1bac17ccc5b313516c5e16fb24f7659aa5ebed",
    keyHash:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f",
    subscriptionId: 580,
  },
};

async function main() {
  console.log("Start deploy...");
  const Randomness = await ethers.getContractFactory("Randomness");

  const { link, vrfCoordinator, keyHash, subscriptionId } =
    DEPLOY_OPTIONS.mumbai;

  const randomness = await Randomness.deploy(
    subscriptionId,
    vrfCoordinator,
    link,
    keyHash
  );

  await randomness.deployed();
  console.log("Randomness deployed to:", randomness.address);
  console.log("Waiting for 5 confirmations...");

  await ethers.provider.waitForTransaction(
    randomness.deployTransaction.hash,
    5,
    150000
  );

  console.log("Confirmed 5 times");

  await run("verify:verify", {
    address: randomness.address,
    contract: "contracts/Randomness.sol:Randomness",
    constructorArguments: [subscriptionId, vrfCoordinator, link, keyHash],
  });

  console.log("Contract verified");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
