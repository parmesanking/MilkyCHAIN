pragma solidity ^0.4.24;
// Define a contract 'Supplychain'

import './Milk.sol';

import '../milkaccesscontrol/FarmerRole.sol';
import '../milkaccesscontrol/TransporterRole.sol';
import '../milkaccesscontrol/BottlingFarmRole.sol';
import '../milkaccesscontrol/DistributorRole.sol';
import '../milkaccesscontrol/ConsumerRole.sol';

import '../milkcore/Ownable.sol';
contract SupplyChain is Ownable, Milk, FarmerRole, TransporterRole,BottlingFarmRole,DistributorRole, ConsumerRole {

  // Define a modifier that checks if the paid amount is sufficient to cover the price
  modifier paidEnough(uint _price) { 
    require(msg.value >= _price, "Not enough money given"); 
    _;
  }
  
  // Define a modifier that checks the price and refunds the remaining balance
  modifier checkValue(uint _upc) {
    _;
    uint _price = items[_upc].productPrice;
    uint amountToReturn = msg.value - _price;
    items[_upc].consumerID.transfer(amountToReturn);
  }

  // Define a function 'kill' if required
    function kill() public {
    if (isOwner()){
      selfdestruct(msg.sender);
    }
  }

  // Define a function 'milkCow' that allows a farmer to mark an item 'Milked'
  function milkCow(address _fromCow,  address _originFarmerID, string _originFarmName, string _originFarmInformation, string  _originFarmLatitude, string  _originFarmLongitude, string  _productNotes) public onlyFarmer
  {
    // Add the new item as part of Harvest

    MilkItem memory milk;
    milk.sku = sku;
    milk.upc= upc;
    milk.cow = _fromCow;
    milk.state = MilkState.Milked;
    milk.ownerID = msg.sender;
    milk.originFarmerID = _originFarmerID;
    milk.originFarmName = _originFarmName;
    milk.originFarmInformation = _originFarmInformation;
    milk.originFarmLatitude=_originFarmLatitude;
    milk.originFarmLongitude=_originFarmLongitude;
    milk.productID = upc + sku;
    milk.productNotes = _productNotes;
        
    items[upc] = milk;
    
    // Increment sku
    upc = upc + 1;
    sku = sku + 1;
    // Emit the appropriate event
    emit CowMilked(upc, _fromCow);
  }

  // Define a function 'processtItem' that allows a farmer to mark an item 'Processed'
  function refrigerate(uint _upc) public onlyFarmer() isMilked(_upc)
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.StoredInColdTank;

    // Emit the appropriate event
    emit StoredInFarm(_upc);    
  }

  // Define a function 'processtItem' that allows a farmer to mark an item 'Processed'
  function onFarmInspect(uint _upc) public onlyFarmer() isStoredInColdTank(_upc)
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.InspectedOnFarm;

    // Emit the appropriate event
    emit OnFarmInspected(_upc);    
  }


  // Define a function 'packItem' that allows a farmer to mark an item 'Packed'
  function pick(uint _upc) public onlyTransporter() isInspectedOnFarm(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.TankShipped;
    items[_upc].ownerID = msg.sender;
    items[_upc].transporterID = msg.sender;

    // Emit the appropriate event
    emit PickedFromFarm(_upc);
  }
 function ship(uint _upc) public onlyTransporter() isTankShipped(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.StoredInHugeTank;

    // Emit the appropriate event
    emit ShippedToBottlingFarm(_upc);
  }

function onBottlingFarmInspect(uint _upc) public onlyBottlingFarm() isStoredInHugeTank(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.InspectedOnBottlingFarm;
    items[_upc].ownerID = msg.sender;
    items[_upc].bottlingFarmID = msg.sender;

    // Emit the appropriate event
    emit OnBottlingFarmInspected(_upc);
  }

function bottle(uint _upc) public onlyBottlingFarm() isInspectedOnBottlingFarm(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.Bottled;

    // Emit the appropriate event
    emit Bottled(_upc);
  }

  function pack(uint _upc) public onlyBottlingFarm() isBottled(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.Packed;

    // Emit the appropriate event
    emit Packed(_upc);
  }


  function delivery(uint _upc) public onlyBottlingFarm() isPacked(_upc)
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.Delivered;
    // Emit the appropriate event
    emit Shipped(_upc);
  }



  // Define a function 'sellItem' that allows a farmer to mark an item 'ForSale'
  function sell(uint _upc, uint _price) public onlyDistributor() isDelivered(_upc)
  // Call modifier to check if upc has passed previous supply chain stage
  
  // Call modifier to verify caller of this function
  
  {
    // Update the appropriate fields
    items[_upc].state = MilkState.OnSale ;
    items[_upc].ownerID = msg.sender ;
    items[_upc].distributorID = msg.sender ;
     items[_upc].productPrice = _price ;
    
    
    // Emit the appropriate event
    emit ForSale(_upc);
  }

  // Define a function 'buyItem' that allows the disributor to mark an item 'Sold'
  // Use the above defined modifiers to check if the item is available for sale, if the buyer has paid enough, 
  // and any excess ether sent is refunded back to the buyer
  function buy(uint _upc) public payable 
    // Call modifier to check if upc has passed previous supply chain stage
    isOnSale(_upc)
    onlyConsumer()
    // Call modifer to check if buyer has paid enough
    paidEnough (items[_upc].productPrice)
    // Call modifer to send any excess ether back to buyer
    checkValue (_upc)
    {
    // Update the appropriate fields - ownerID, distributorID, itemState
    items[_upc].state = MilkState.Purchased ;
    items[_upc].ownerID = msg.sender ;
    items[_upc].consumerID = msg.sender;

    // Transfer money to supply chain actors
    uint price = items[_upc].productPrice;
    
    uint transporterPrice = price * 10 /100;
    uint bottlingFarmPrice = price * 10 /100;
    uint distributorPrice = price * 10 /100;
    uint farmerPrice = price - transporterPrice - bottlingFarmPrice - distributorPrice;
    
    items[_upc].transporterID.transfer(transporterPrice);
    items[_upc].bottlingFarmID.transfer(bottlingFarmPrice);
    items[_upc].distributorID.transfer(distributorPrice);
    items[_upc].originFarmerID.transfer(farmerPrice);

  
    // emit the appropriate event
    emit Purchased(_upc);
  }
function consume(uint _upc) public  
    // Call modifier to check if upc has passed previous supply chain stage
    onlyConsumer()
    // Call modifer to check if buyer has paid enough
    isPurchased(_upc)
    {
    // Update the appropriate fields - ownerID, distributorID, itemState
    items[_upc].state = MilkState.Consumed ;
 
    // emit the appropriate event
    emit Consumed(_upc);
  }
}
