function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function sleep() {
  return await timeout(10000);
}

function get(chainId) {
  const fs = require("fs");

  const filename = "../astro-addresses/" + chainId + ".json";

  const data = fs.existsSync(filename)
    ? JSON.parse(fs.readFileSync(filename, "utf8"))
    : {};

  return data;
}

async function transferOwnership(address, newOwnwer) {
  console.log(
    "transfer ownership, contract ",
    address,
    " new owner",
    newOwnwer
  );
  console.log(0);
  const contract = await ethers.getContractAt("Ownable", address);
  console.log(1);
  const signers = await ethers.getSigners();
  console.log(2);
  const nonce = await ethers.provider.getTransactionCount(signers[0]._address);
  console.log(3);

  await sleep(3000);
  console.log(4);
  return await contract.transferOwnership(newOwnwer, { nonce });
}

//we need it to make farming and staking work
async function main() {
  const { chainId } = await ethers.provider.getNetwork();

  const data = get(chainId);

  const newAdmin = "0xd83505B991E52D1B0fC5247982e85f65087bb242";

  await transferOwnership(data.AstroStakingFactory, newAdmin);
  await transferOwnership(data.AstroFarm, newAdmin);
  await transferOwnership(data.AstroVault, newAdmin);
  await transferOwnership(data.VaultOwner, newAdmin);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
