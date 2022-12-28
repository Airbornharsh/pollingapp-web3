const { run } = require("hardhat");

const main = async () => {
  const contractAddress = "0xfB928f5f53f1394dABABCc7AFEd0292Df5F55dFe";
  const args = [];
  try {
    console.log("Verifying------");
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log("Verified");
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified!");
    } else {
      console.log(e);
    }
  }
};

main();
