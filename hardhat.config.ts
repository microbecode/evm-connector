import dotenv from "dotenv";
dotenv.config();
import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";
import "hardhat-typechain";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

const privKey = process.env.PRIVATE_KEY;
const providerRopsten = process.env.PROVIDER_ROPSTEN;
const providerMainnet = process.env.PROVIDER_MAINNET;

const needsProvider =
  process.env.npm_config_argv &&
  (process.env.npm_config_argv.includes("rinkeby") ||
    process.env.npm_config_argv.includes("ropsten") ||
    process.env.npm_config_argv.includes("mainnet"));

if ((!privKey || !providerRopsten) && needsProvider) {
  console.error("Please set a private key and provider.");
  process.exit(0);
}

const privKeyExists = privKey as string;

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      }
    ],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    /*     ropsten: {
          url: providerRopsten,
          accounts: [privKeyExists],
          gasPrice: 2000000000 // 2gwei
        },
        mainnet: {
          url: providerMainnet,
          accounts: [privKeyExists]
        } */
  },
  /*   etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY
    } */
  // defaultNetwork: "hardhat",
  // networks: {
  //   localhost: {
  //     chainId: 1337,
  //   },
  // },
};

export default config;
