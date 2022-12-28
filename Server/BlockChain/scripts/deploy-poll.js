const hre = require("hardhat");

async function main() {
  console.log("Started");
  const Poll = await hre.ethers.getContractFactory("Poll");
  console.log("Step 1 Done");
  const poll = await Poll.deploy();
  console.log("Step 2 Done");

  await poll.deployed();
  console.log("Step 3 Done");
  console.log(`Poll deployed to ${poll.address}`);

  console.log("waiting");
  await poll.deployTransaction.wait(8);
  console.log("Waited");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports.tags = ["all", "deploy"];
