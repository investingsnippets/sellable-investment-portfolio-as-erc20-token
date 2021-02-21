import React from "react";
import './ManagePortfolio.css'

class ManagePortfolio extends React.Component {
  state = { 
    stackId: null,
    tokenName: '',
    tokenSymbol: '',
    tokenAddress: '',
    tokenWeight: '',
    hasError: false
  };

  handleChange = evt => {
    const value = evt.target.value;
    this.setState({
      ...this.state,
      [evt.target.name]: value
    });
  }

  addAsset = async (e) => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.PortfolioToken;

    // https://github.com/trufflesuite/drizzle/issues/84
    const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
    try {
      const gasAmount = await instance.methods
                                .addAsset(
                                  this.state.tokenAddress,
                                  parseInt(this.state.tokenWeight),
                                  this.state.tokenName,
                                  this.state.tokenSymbol
                                )
                                .estimateGas();
        
      const stackId = contract.methods["addAsset"].cacheSend(
        this.state.tokenAddress,
        parseInt(this.state.tokenWeight),
        this.state.tokenName,
        this.state.tokenSymbol,
        {
          from: drizzleState.accounts[0],
          gas: gasAmount
        }
      );
      // save the `stackId` for later reference
      this.setState({ 
        ...this.state,
        stackId,
        tokenName: '',
        tokenSymbol: '',
        tokenAddress: '',
        tokenWeight: '',
        gasAmount
      });
    } catch (error) {
      console.log(error);
      this.setState({
        ...this.state,
        tokenName: '',
        tokenSymbol: '',
        tokenAddress: '',
        tokenWeight: '',
        hasError: true,
        errorMessage: JSON.stringify(error)
      });
    } 
  };

  editAsset = async (e) => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.PortfolioToken;

    const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
    try {
      const gasAmount = await instance.methods
                                .editAsset(
                                  this.state.tokenAddress,
                                  parseInt(this.state.tokenWeight)
                                )
                                .estimateGas();
        
      const stackId = contract.methods["editAsset"].cacheSend(
        this.state.tokenAddress,
        parseInt(this.state.tokenWeight),
        {
          from: drizzleState.accounts[0],
          gas: gasAmount
        }
      );
      // save the `stackId` for later reference
      this.setState({ 
        ...this.state,
        tokenAddress: '',
        tokenWeight: '',
        stackId,
        gasAmount
      });
    } catch (error) {
      console.log(error);
      this.setState({
        ...this.state,
        tokenAddress: '',
        tokenWeight: '',
        hasError: true,
        errorMessage: JSON.stringify(error)
      });
    } 
  };

  removeAsset = async (e) => {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.PortfolioToken;

    const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
    try {
      const gasAmount = await instance.methods
                                .removeAsset(
                                  this.state.tokenAddress
                                )
                                .estimateGas();
        
      const stackId = contract.methods["removeAsset"].cacheSend(
        this.state.tokenAddress, 
        {
          from: drizzleState.accounts[0],
          gas: gasAmount
        }
      );
      // save the `stackId` for later reference
      this.setState({ 
        ...this.state,
        tokenAddress: '',
        stackId,
        gasAmount
      });
    } catch (error) {
      console.log(error);
      this.setState({
        ...this.state,
        tokenAddress: '',
        hasError: true,
        errorMessage: JSON.stringify(error)
      });
    }
  };

  getTxStatus = () => {
    // get the transaction states from the drizzle state
    const { transactions, transactionStack } = this.props.drizzleState;

    // get the transaction hash using our saved `stackId`
    const txHash = transactionStack[this.state.stackId];

    // if transaction hash does not exist, don't display anything
    if (!txHash) return null;

    // otherwise, return the transaction status
    return `Transaction status: ${transactions[txHash] && transactions[txHash].status} (Gas: ${this.state.gasAmount})`;
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>
            {this.state.errorMessage}
          </p>
        </div>
      );
    }
    return (
      <div>
        <h2>Manage Portfolio</h2>
        <div className='ManagePortfolio'>
          <div className="ManagePortfolio-add">
            <h3>Add</h3>
            
            <input
              type="text"
              name="tokenName"
              placeholder="Token Name"
              value={this.state.tokenName}
              onChange={this.handleChange}
            />
            
            <input
              type="text"
              name="tokenSymbol"
              placeholder="Token Symbol"
              value={this.state.tokenSymbol}
              onChange={this.handleChange}
            />
          
            <input
              type="text"
              name="tokenAddress"
              placeholder="Token Address"
              value={this.state.tokenAddress}
              onChange={this.handleChange}
            />
          
            <input
              type="text"
              name="tokenWeight"
              pattern="^[0-9]+$"
              placeholder="Weight In the portfolio [0-100]"
              value={this.state.tokenWeight}
              onChange={this.handleChange}
            />
            <button onClick={this.addAsset}>
              Add
            </button>
          </div>

          <div className="ManagePortfolio-change">
            <h2>Change/Remove</h2>
            <input
              type="text"
              name="tokenAddress"
              placeholder="Token Address"
              value={this.state.tokenAddress}
              onChange={this.handleChange}
            />
          
            <input
              type="text"
              name="tokenWeight"
              pattern="^[0-9]+$"
              placeholder="Weight In the portfolio [0-100]"
              value={this.state.tokenWeight}
              onChange={this.handleChange}
            />
            <div className="ManagePortfolio-change-remove">
              <button onClick={this.editAsset}>
                Change
              </button>
              &nbsp;
              <button onClick={this.removeAsset}>
                Remove
              </button>
            </div>
          </div>
        </div>
        <div>{this.getTxStatus()}</div>
      </div>
    );
  };
}

export default ManagePortfolio;