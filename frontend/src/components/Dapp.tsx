import React, { useEffect, useState } from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { Container } from "react-bootstrap";
import { ContractsContext, Web3Context } from "../contexts/Context";
import { NoWalletDetected } from "./NoWalletDetected";
import { Footer } from "./common/Footer";
import { Header } from "./common/Header";
import { Progress } from "./Progress";
import { ContractInteract } from "./contract/ContractInteract";
import { What } from "./What";
import { Copyright } from "./common/Copyright";
import { useParams } from "react-router-dom";

// This is an error code that indicates that the user canceled a transaction
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

// This component is in charge of doing these things:
//   1. It connects to the user's wallet
//   2. Initializes ethers and the Token contract
//   3. Polls the user balance to keep it updated.
//   4. Transfers tokens by sending transactions
//   5. Renders the whole application
//
// Note that (3) and (4) are specific of this sample application, but they show
// you how to keep your Dapp and contract's state in sync,  and how to send a
// transaction.

declare global {
  interface Window {
    ethereum: any;
  }
}

export function Dapp() {
  const [selectedAddress, setSelectedAddress] = useState<string>(undefined);

  const readyParams = useParams() as { contract?: string };

  // This method resets the state
  function _resetState() {
    setSelectedAddress(undefined);
  }

  async function _connectWallet() {
    console.log("connecting...");
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    _initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]: Array<string>) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      _initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]: Array<string>) => {
      _resetState();
    });
  }

  function _initialize(userAddress: string) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    setSelectedAddress(userAddress);
  }

  // This method just clears part of the state.
  /*   function _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  } */

  // This method just clears part of the state.
  /*   function _dismissNetworkError() {
    this.setState({ networkError: undefined });
  } */

  // This is an utility method that turns an RPC error into a human readable
  // message.
  /*   function _getRpcErrorMessage(error: ErrorType): string {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  } */

  return (
    <div>
      <Web3Context.Provider
        value={{
          selectedAddress,
        }}
      >
        <ContractsContext.Provider
          value={{
            myContract: null,
          }}
        >
          <Header
            connectWallet={() => _connectWallet()}
            selectedAddress={selectedAddress}
          />

          <Container fluid>
            {
              // Ethereum wallets inject the window.ethereum object.
              // If it hasn't been injected, we instruct the user to install MetaMask.
              window.ethereum === undefined ? <NoWalletDetected /> : null
            }

            <What></What>

            <ContractInteract
              contractData={readyParams.contract}
            ></ContractInteract>

            <Footer />
          </Container>

          <Copyright />
        </ContractsContext.Provider>
      </Web3Context.Provider>
    </div>
  );
}
