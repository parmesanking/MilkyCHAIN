const HDWalletProvider = require("truffle-hdwallet-provider");
const PrivateKeyProvider = require("truffle-privatekey-provider");

const rinkebyURL =
  "https://rinkeby.infura.io/v3/396d0708e95844fd8c87d9c6df4a0a8a";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new PrivateKeyProvider(node.env.PRIVATE_KEY, rinkebyURL);
      },
      network_id: "4"
    },
    rinkeby2: {
      provider: function() {
        return new HDWalletProvider(node.env.MNEMONIC, rinkebyURL);
      },
      network_id: "4",
      gas: 9712390
    }
  },
  compilers: {
    solc: {
      version: "0.4.24" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};
