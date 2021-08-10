import React from "react";
import { BigNumber, Contract, ethers } from "ethers";
import { Container } from "react-bootstrap";
import { ContractsContext, Web3Context } from "../contexts/Context";
import { NoWalletDetected } from "./NoWalletDetected";
import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";
import { Footer } from "./common/Footer";
import { Header } from "./common/Header";
import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Progress } from "./Progress";
import { Copyright } from "./common/Copyright";
import { FunctionInteract } from "./function/FunctionInteract";
import { What } from "./What";

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

type TokenData = {
  name?: string;
  symbol?: string;
  decimals?: string;
};

type ErrorType = {
  data: {
    message: string;
  };
  message: string;
};

type DappState = {
  tokenData?: TokenData;
  selectedAddress?: string;
  balance?: BigNumber;
  decimals?: string;
  txBeingSent?: string;
  transactionError?: ErrorType;
  networkError?: string;
  isDarkTheme?: boolean;
  isProcessing?: boolean;
};

export class Dapp extends React.Component<{}, DappState> {
  private _provider?: ethers.providers.Web3Provider;

  private _pollDataInterval?: number;

  private initialState: DappState = {
    selectedAddress: undefined,
    txBeingSent: undefined,
    transactionError: undefined,
    networkError: undefined,
    isDarkTheme: undefined,
    isProcessing: undefined
  };

  constructor(props: any) {
    super(props);
    this.state = this.initialState;
  }

  render() {
    const {
      selectedAddress,
      isDarkTheme,
      isProcessing,
    } = this.state;


    return (
      <div>
        <Web3Context.Provider
          value={{
            selectedAddress
          }}
        >
          <ContractsContext.Provider
            value={{
              myContract : null
            }}
          >
            <Header
              connectWallet={() => this._connectWallet()}
              selectedAddress={this.state.selectedAddress}
            />

            <Container fluid>
              {
                // Ethereum wallets inject the window.ethereum object.
                // If it hasn't been injected, we instruct the user to install MetaMask.
                window.ethereum === undefined ? <NoWalletDetected /> : null
              }

              {this.state.networkError &&
                <div className="row justify-content-md-center">
                  <div className="col-12 text-center">
                      <NetworkErrorMessage
                        message={this.state.networkError}
                        dismiss={() => this._dismissNetworkError()}
                      /> 
                  </div>
                </div>
              }

              {(this.state.txBeingSent || this.state.transactionError) && 
                <div className="row mt-5">
                  <div className="col-12">
                    {/*
                    Sending a transaction isn't an immediate action. You have to wait
                    for it to be mined.
                    If we are waiting for one, we show a message here.
                  */}
                    {this.state.txBeingSent && (
                      <WaitingForTransactionMessage
                        txHash={this.state.txBeingSent}
                      />
                    )}
                    {/*
                    Sending a transaction can fail in multiple ways. 
                    If that happened, we show a message here.
                    */}
                    {this.state.transactionError && (
                      <TransactionErrorMessage
                        message={this._getRpcErrorMessage(
                          this.state.transactionError,
                        )}
                        dismiss={() => this._dismissTransactionError()}
                      />
                    )}
                  </div>
                </div>
              }
              <What></What>

              <FunctionInteract></FunctionInteract>

              <Footer />

              <Progress isProcessing={isProcessing} />
            </Container>

            <Copyright />
          </ContractsContext.Provider>
        </Web3Context.Provider>
      </div>
    );
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();
  }

  async _connectWallet() {
    console.log("connecting...");
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Once we have the address, we can initialize the application.

    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]: Array<string>) => {
      this._stopPollingData();
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state
      if (newAddress === undefined) {
        return this._resetState();
      }

      this._initialize(newAddress);
    });

    // We reset the dapp state if the network is changed
    window.ethereum.on("chainChanged", ([networkId]: Array<string>) => {
      this._stopPollingData();
      this._resetState();
    });
  }

  _initialize(userAddress: string) {
    // This method initializes the dapp

    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });

    // Then, we initialize ethers, fetch the token's data, and start polling
    // for the user's balance.

    // Fetching the token data and the user's balance are specific to this
    // sample project, but you can reuse the same initialization pattern.
    this._initializeEthers();
  }

  async _initializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // When, we initialize the contract using that provider and the token's
    // artifact. You can do this same thing with your contracts.
  }

  _stopPollingData() {
    window.clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  // This method just clears part of the state.
  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  // This method just clears part of the state.
  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  // This is an utility method that turns an RPC error into a human readable
  // message.
  _getRpcErrorMessage(error: ErrorType): string {
    if (error.data) {
      return error.data.message;
    }
    return error.message;
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }
}
