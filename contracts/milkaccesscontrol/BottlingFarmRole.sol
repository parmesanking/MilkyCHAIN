pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'BottlingFarmRole' to manage this role - add, remove, check
contract BottlingFarmRole {
  using Roles for Roles.Role;
  // Define 2 events, one for Adding, and other for Removing
  event BottlingFarmAdded(address indexed account);
  event BottlingFarmRemoved(address indexed account);
  // Define a struct 'retailers' by inheriting from 'Roles' library, struct Role
  Roles.Role private bottlingfarms;

  // In the constructor make the address that deploys this contract the 1st retailer
  constructor() public {
    _addBottlingFarm(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyBottlingFarm() {
    require(isBottlingFarm(msg.sender), "Account is not a bottling farm");
    _;
  }

  // Define a function 'isBottlingFarm' to check this role
  function isBottlingFarm(address account) public view returns (bool) {
    return bottlingfarms.has(account);
  }

  // Define a function 'addBottlingFarm' that adds this role
  function addBottlingFarm(address account) public onlyBottlingFarm {
    _addBottlingFarm(account);
  }

  // Define a function 'renounceBottlingFarm' to renounce this role
  function renounceBottlingFarm() public {
    _removeBottlingFarm(msg.sender);
  }

  // Define an internal function '_addBottlingFarm' to add this role, called by 'addBottlingFarm'
  function _addBottlingFarm(address account) internal {
    bottlingfarms.add(account);
    emit BottlingFarmAdded(account);
  }

  // Define an internal function '_removeBottlingFarm' to remove this role, called by 'removeBottlingFarm'
  function _removeBottlingFarm(address account) internal {
    bottlingfarms.remove(account);
    emit BottlingFarmRemoved(account);
  }
}