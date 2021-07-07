// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Sample {
    uint stor;
    function NoReturnDefault() public {

    } 
    function NoReturnDefault(uint a, string calldata b, address c, bytes calldata d) public {

    }  
    function NoReturnView() public view {

    } 
    function NoReturnView(uint a, string calldata b, address c, bytes calldata d) public view {

    } 
    function NoReturnPayable() public payable {

    } 
    function NoReturnPayable(uint a, string calldata b, address c, bytes calldata d) public payable {

    } 

    function ReturnDefault() public returns(uint, string memory, address, bytes memory)  {
        stor = 5;
        string memory b = "hello";
        address c = msg.sender;
        bytes memory d = "there";
        return (stor,b,c,d);
    } 

    function ReturnNamedDefault() public returns(uint a, string memory b, address c, bytes memory d)  {
        stor = 5;
        a = stor;
        b = string("hello");
        c = msg.sender;
        d = "there";
    } 
    
    function ReturnView() public view returns(uint, string memory, address, bytes memory)  {
        uint a = 5;
        string memory b = "hello";
        address c = msg.sender;
        bytes memory d = "there";
        return (a,b,c,d);
    } 
}
