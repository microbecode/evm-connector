# EVM Connector

This is a tool for interacting with arbitrary contracts on any EVM
(Ethereum Virtual Machine) based blockchain, without an ABI. Defined
functions can be shared via URL, so this can be utilized as a contract
dashboard. The tool utilizes your installed browser wallet (MetaMask).

EVM-based blockchains are for example:

<ul>
    <li>Ethereum</li>
    <li>Binance Smart Chain</li>
    <li>Tron</li>
    <li>Layer 2 / sidechain solutions, such as Optimism</li>
</ul>

## Web app

The app is deployed at https://evmconnector.dev

![alt text](example.png)

<i>An example where the tool is used to check the ERC20 balance of an address</i>

## Functionality

This tool is meant to be used if you know a function you want to interact with, but don't have the tools nor the ABI to interact with the function in more conventional ways.

### Share contract definition

Once you have defined a contract with functions, you can share the interaction page with others via a URL. You can generate a URL for any contract you have defined in this tool and other will be able to access the same contract functionality via the URL. Click the "Generate shareable URL" button to generate a contract URL.

Sharing a contract through URL includes the following information:

- Contract address
- Contract functions:
  - Name of the function
  - Function type
  - Function input and output parameters without values

Once another user opens the site through such contract URL, the data is populated for him. In order to interact with the contract, the user needs to:

1. Connect his wallet and connect to the correct network
1. Choose which function he wants to interact with
1. Enter needed input values for the possible input parameters
1. Execute the function

### Chosen network

The blockchain network to use is determined by your browser wallet. Its chainId (https://chainlist.org/) is displayed in the "Execute" button.

### Defining function

You can either add your own custom function, or use the predefined contract templates to add functions from standard contracts.

### Function interaction

If you choose to define a custom function, you have to at least define "function name" and "contract address".

## Possible questions

This tool is mostly meant for developers who know what they are doing. Anyway, here are answers to some of the most obvious questions:

<p>Q: What is the "default" function type? A: It means there is no explicit function type specified in the function signature. It implies a "nonpayable" function which can do state changes but has no special properties. </p>

<p>Q: Why can't I sometimes see the result of the function execution? A: There is no way to get function result data if the call is in a real transaction.</p>

<p>Q: Why is there an option to specify the execution type? A: Normally you can just leave this to be the default value.But if you need, for example, the return value from a state-changing function, you can change this to "Local call" to simulate calling the function as type `view` even if really isn't a `view` function. This way you can get the resulting data (although no state changes are performed).</p>

## Future development

Some future development is considered and issues are created for those this repo. Please feel free to leave feedback!

# Technical stuff

## Technologies used

- Node v14.15
- Solidity 0.7.5 (only for some local testing)
- Hardhat
- Ethers.js
- ReactJS
- TypeScript
- ESLint / Prettier

## Instructions

You can run the project fully locally with the following instructions.

To run local blockchain:

```
npm run localchain
```

To deploy the example contract locally:

```
npm run deploy-local
```

To run the frontend locally:

```
npm run serve-frontend
```

# Contact

If you have any questions or comments, feel free to poke me at http://t .me/Lauri_P . Hope you find the tool useful!
