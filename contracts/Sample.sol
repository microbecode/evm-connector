// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Sample {
    uint stor;
    // test case 1
    function NoReturnDefault() public {
    } 

    // test case 2
    function NoReturnDefault(uint a, string calldata b, address c, bytes calldata d) public {
    }  

    // test case 3
    function NoReturnView() public view {
    } 

    // test case 4
    function NoReturnView(uint a, string calldata b, address c, bytes calldata d) public view {
    } 

    // test case 5
    function NoReturnPayable() public payable {
    } 

    // test case 6
    function NoReturnPayable(uint a, string calldata b, address c, bytes calldata d) public payable {
    } 

    // test case 7
    function ReturnDefault() public returns(uint, string memory, address, bytes memory)  {
        stor = 5;
        string memory b = "hello";
        address c = msg.sender;
        bytes memory d = "there";
        return (stor,b,c,d);
    } 

    // test case 8
    function ReturnNamedDefault() public returns(uint a, string memory b, address c, bytes memory d)  {
        stor = 5;
        a = stor;
        b = string("hello");
        c = msg.sender;
        d = "there";
    } 
    
    // test case 9
    function ReturnView() public view returns(uint, string memory, address, bytes memory)  {
        uint a = 5;
        string memory b = "hello";
        address c = msg.sender;
        bytes memory d = "there";
        return (a,b,c,d);
    } 
}
