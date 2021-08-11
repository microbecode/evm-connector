// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Sample {
    uint stor;
    // test case 1
    function NoReturnDefault() public {
    } 

    // test case 2
    function NoReturnDefault(uint a, string calldata b, address c) public {
    }  

    // test case 3
    function NoReturnView() public view {
    } 

    // test case 4
    function NoReturnView(uint a, string calldata b, address c) public view {
    } 

    // test case 5
    function NoReturnPayable(uint a, string calldata b, address c, string[] calldata d) public payable {
    } 

    // test case 6
    function ReturnDefault() public returns(uint, string memory, address, int64[] memory)  {
        stor = 5;
        string memory b = "hello";
        address c = msg.sender;
        int64[] memory d = new int64[](3);
        d[0] = int64(-5);
        d[2] = int64(6);
        return (stor,b,c,d);
    } 

    // test case 7
    function ReturnNamedDefault() public returns(uint a, string memory b, address c)  {
        stor = 5;
        a = stor;
        b = string("hello");
        c = msg.sender;
    } 
    
    // test case 8
    function ReturnView() public view returns(uint, string memory, address, bool)  {
        uint a = 5;
        string memory b = "hello";
        address c = msg.sender;
        bool d = true;
        return (a,b,c,d);
    }

    function Test1(uint a) public {
        if (a > 5) {
            revert();
        }
    }
}
