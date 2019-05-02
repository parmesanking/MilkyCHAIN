App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    cowID: "0x0000000000000000000000000000000000000000",
    originFarmName: "Future Farm",
    originFarmInformation: "Milk farm of the new era",
    originFarmLatitude: "42.12456",
    originFarmLongitude: "12.87656",
    productNotes: "Tasteful milk",
    productPrice: 2.5,
    bottlingFarmID: "0x0000000000000000000000000000000000000000",
    transporterID: "0x0000000000000000000000000000000000000000",
    distributorID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },


    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.transporterID = $("#transporterID").val();
        App.bottingFarmID = $("#bottingFarmID").val();
        App.distributorID = $("#distributorID").val();
        App.consumerID = $("#consumerID").val();
        App.roleAddress= $("#roleAddress").val();
        App.role= $("#role").val();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/396d0708e95844fd8c87d9c6df4a0a8a');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);

            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        App.readForm();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 0:
                return await App.assignRole(event);
                break;
            case 1:
                return await App.milkCow(event);
                break;
            case 2:
                return await App.refrigerate(event);
                break;
            case 3:
                return await App.onFarmInspect(event);
                break;
            case 4:
                return await App.pick(event);
                break;
            case 5:
                return await App.ship(event);
                break;
            case 6:
                return await App.onBottlingFarmInspect(event);
                break;
            case 7:
                return await App.bottle(event);
                break;
            case 8:
                return await App.pack(event);
                break;
            case 9:
                return await App.delivery(event);
                break;
            case 10:
                return await App.sell(event);
                break;
            case 11:
                return await App.buy(event);
                break;
            case 12:
                return await App.consume(event);
                break;
            case 13:
                return await App.fetchItemBufferOne(event);
                break;
            case 14:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    assignRole: function(event) {
        event.preventDefault();
        new Promise((resolve, reject) => {
            App.contracts.SupplyChain.deployed().then((instance)=> {
                switch(App.role) {
                    case "Farmer":
                        return  instance.addFarmer(App.roleAddress, {from:App.ownerID})
                        break;
                    case "Transporter":
                        return  instance.addTransporter(App.roleAddress, {from:App.ownerID})
                        break;
                    case "BottlingFarm":
                        return  instance.addBottlingFarm(App.roleAddress, {from:App.ownerID})
                        break;
                    case "Distributor":
                        return  instance.addDistributor(App.roleAddress, {from:App.ownerID})
                        break;
                    case "Consumer":
                        return  instance.addConsumer(App.roleAddress, {from:App.ownerID})
                        break;
                }
            })
           
        }).catch(alert);
            

       
    },
    

    milkCow: function(event) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.milkCow(
                App.cowID,
                App.metamaskAccountID, 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes, 
                {from:App.metamaskAccountID}
              );
            
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    refrigerate: function (event) {
        event.preventDefault();
     
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.refrigerate(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('refrigerate',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    onFarmInspect: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.onFarmInspect(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('onFarmInspect',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    pick: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.pick(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('onFarmInspect',result);
        }).catch(function(err) {
            console.log(err.message);
        });
/*
        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
        */
    },
    

    ship: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.ship(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('ship',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    onBottlingFarmInspect: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.onBottlingFarmInspect(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('onBottlingFarmInspect',result);
        }).catch(function(err) {
            console.log(err.message);
        })
    },
    bottle: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.bottle(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('bottle',result);
        }).catch(function(err) {
            console.log(err.message);
        })
    },
    pack: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.pack(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('pack',result);
        }).catch(function(err) {
            console.log(err.message);
        })
    },
    delivery: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.delivery(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('deliver',result);
        }).catch(function(err) {
            console.log(err.message);
        })
    },

    sell: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.sell(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('sell',result);
        }).catch(function(err) {
            console.log(err.message);
        })
    },
    buy: function (event) {
        event.preventDefault();
        App.contracts.SupplyChain.deployed().then(function(instance) {
            //send more money than the product price
            const walletValue = web3.toWei(3 * App.productPrice, "ether");
            return instance.buy(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('buy',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    consume: function (event) {
        event.preventDefault();

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.consume(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-item").text(result);
            console.log('consume',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },


    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          console.log('fetchItemBufferOne', result[0]);
          
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          console.log('fetchItemBufferTwo', result);
          $("#productNotes").val(result[3]);
          $("#productPrice").val(result[4]);
          $("#transporterID").val(result[6]);
          $("#bottlingFarmID").val(result[7]);
          $("#distributorID").val(result[8]);
          $("#consumerID").val(result[9]);
        }).catch(function(err) {
          console.log(err.message);
        
          
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
