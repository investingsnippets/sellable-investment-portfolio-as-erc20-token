const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    /* ... other networks */

    // To connect to the ganache app installed on your host
    // first find the host ip since you need to access 
    // ganache from inside docker
    // ganacheui: {
    //   host: '192.168.1.113',
    //   port: 7545,
    //   network_id: "*",
    //   websockets: true
    // }

    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: "*",
      websockets: true,
      gas: 12500000, // Block Gas Limit same as latest on Mainnet https://ethstats.net/
      gasPrice: 110000000000, // same as latest on Mainnet https://ethstats.net/
    }
  },
  compilers: {
    solc: {
      version: "0.6.10"
    }
  }
};
