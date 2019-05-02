const HDWalletProvider = require("truffle-hdwallet-provider");
const PrivateKeyProvider = require("truffle-privatekey-provider");
const mnemonic =
  "goose mad split chicken attack castle lake tool minor wood wealth glare";

const rinkebyURL =
  "https://rinkeby.infura.io/v3/396d0708e95844fd8c87d9c6df4a0a8a";
const privateKey =
  "b78e6960a33d4e42620850a664a0726735327b977be640710f22cfc54e5f3e79";
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new PrivateKeyProvider(privateKey, rinkebyURL);
      },
      network_id: "4" // Rinkeby ID 4
      //from: "0x6ec31d7061aAB163D19a9f2B02847D27096A6b9b", // account from which to deploy
      //gas: 1000000000000000000
    },
    rinkeby2: {
      provider: function() {
        return new HDWalletProvider(mnemonic, rinkebyURL);
      },
      network_id: "4", // Rinkeby ID 4
      from: "0x6ec31d7061aAB163D19a9f2B02847D27096A6b9b", // account from which to deploy
      gas: 9712390
    },
    rinkeby3: {
      host: "192.168.5.200",
      port: 8545,
      from: "0x6ec31d7061aAB163D19a9f2B02847D27096A6b9b", 
      network_id: "4" // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.4.24" // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }
};
