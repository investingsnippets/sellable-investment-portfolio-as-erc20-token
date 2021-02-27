import React from "react";
import './DisplayPortfolio.css'

class DisplayPortfolio extends React.Component {
  state = { isLoading: true, refresh: false };
  
  async componentDidMount() {
    const { drizzle, drizzleState } = this.props;
    const contract = drizzle.contracts.PortfolioToken;
    const address = contract.address;
    const tokenName = await contract.methods.name().call();
    const tokenSymbol = await contract.methods.symbol().call();
    const tokenDecimals = await contract.methods.decimals().call();
    const tokenTotalSupply = await contract.methods.totalSupply().call();
    const assetList = await this.fetchAssets(contract);
    
    this.setState({ 
      ...this.state,
      address,
      tokenName,
      tokenSymbol,
      tokenDecimals,
      tokenTotalSupply,
      contract,
      assetList,
      refresh: false,
      isLoading: false
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.refresh) {
      const { drizzle, drizzleState } = prevProps;
      const contract = drizzle.contracts.PortfolioToken;
      const assetList = await this.fetchAssets(contract);
      
      this.setState({ 
        ...this.state,
        contract,
        assetList,
        refresh: false,
        isLoading: false
      });
    }
  }

  async fetchAssets(contract) {
    // get the AssetList from the contract
    const assetAddresses = await contract.methods.getAssets().call();
    const assetList = [];
    if (assetAddresses) {
      // for each address in the addresslist fetch the asset info
      for (const assetAddress of assetAddresses) {
        const assetInfo = await contract.methods.getAssetInfo(assetAddress).call();
        if (assetInfo) { // && assetInfo.weight != 0) {
          assetList.push({
            name: assetInfo.name,
            symbol: assetInfo.symbol,
            address: assetAddress,
            weight: assetInfo.weight,
            timestamp: assetInfo.timeStamp
          });
        }
      }
    }
    return assetList;
  }

  onRefresh = evt => {
    this.setState({
      ...this.state,
      refresh: true,
      isLoading: true
    });
  }

  _renderTableData(assetList) {
    return assetList.map((asset, index) => {
      return (
        <tr key={index}>
          {Object.keys(asset).map((key, index) => (<td key={index}>{asset[key]}</td>))}
        </tr>
      );
    })
  }

  _renderTableHeader(assetList) {
    let header = []
    if (assetList.length > 0) {
      header = Object.keys(assetList[0])
    }
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  render() {
    const {address, assetList, tokenName, tokenSymbol,
      tokenDecimals,
      tokenTotalSupply} = this.state;
    return (
      this.state.isLoading? 'Loading...' : 
      <div className='DisplayPortfolio'>
        <h2>Portfolio Info</h2>
        
        <div className="DisplayPortfolio-info">
        <p><b>Token (ERC20) address</b>: {address}</p>
        <p><b>Token Name</b>: {tokenName}</p>
        <p><b>Token Symbol</b>: {tokenSymbol}</p>
        <p><b>Token Decimals</b>: {tokenDecimals}</p>
        <p><b>Token Total Supply</b>: {tokenTotalSupply}</p>
        </div>
        
        <h2>Portfolio Assets</h2>
        <button onClick={this.onRefresh}>
          Refresh
        </button>
        <table className='DisplayPortfolio-assets'>
          <thead>
            <tr>{this._renderTableHeader(assetList)}</tr>
          </thead>
          <tbody>
            {this._renderTableData(assetList)}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DisplayPortfolio;