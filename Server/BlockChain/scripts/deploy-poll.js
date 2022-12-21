// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const { ethers } = require("hardhat");
const hre = require("hardhat");
// const fs = require("fs");

// const FRONT_END_ADDRESSES_FILE = "../../../Constants/contractAddress.json";
// const FRONT_END_ABI_FILE = "../../../Constants/abi.json";

async function main() {
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  const electionTime = 1.1 * 60 ;
  const endElectionTime = Math.round(Date.now() / 1000) + electionTime;
  const questions = ["Dog", "Cat", "Mouse", "All"];

  const Lock = await hre.ethers.getContractFactory("Poll");
  const lock = await Lock.deploy(questions, endElectionTime);

  await lock.deployed();

  console.log(
    `Lock with 1 ETH and End Polling in ${endElectionTime} & deployed to ${lock.address}`
  );

  // if (process.env.UPDATE_FRONT_END) {
  //   console.log("Updating the Frontend");
  //   updateContractAddress();
  //   updateAbi();
  // }
}

// const updateContractAddress = async () => {
//   const poll = await ethers.getContractFactory("Poll");

//   const temp = { address: poll.address };

//   fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(temp));
// };

// const updateAbi = async () => {
//   const poll = await ethers.getContractFactory("Poll");

//   fs.writeFileSync(
//     FRONT_END_ABI_FILE,
//     poll.interface.format(ethers.utils.FormatTypes.json)
//   );
// };

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

module.exports.tags = ["all", "deploy"];
