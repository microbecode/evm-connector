// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Sample {
  uint256 stor;

  function Case1() public {}

  function Case2(
    uint256 a,
    string calldata b,
    address c
  ) public {}

  // test case 3
  function Case3(uint256[] calldata a)
    public
    view
    returns (uint256[] calldata)
  {
    return (a);
  }

  function Case4(uint256[] calldata a, string[2] calldata b)
    public
    view
    returns (uint256[] calldata, string[2] calldata)
  {
    return (a, b);
  }

  function Case5(uint256[2] memory a) public pure returns (uint256[] memory) {
    uint256[] memory d = new uint256[](3);
    d[0] = uint256(5);
    d[2] = uint256(a[1]);
    return d;
  }

  // http://localhost:3000/load/('aE0x5FbDB2315678afecb367f032d93F642f64180aa3'~f.('nECase6'~tEpure'~i.*1')G2[-G3[2A~o.*32[A)])*('tEbytesA').![A-]E!'G,*GEA.-*_
  function Case6(
    bytes1 a,
    bytes2[] memory b,
    bytes3[2] memory c
  ) public pure returns (bytes32[] memory) {
    bytes32[] memory d = new bytes32[](3);
    d[0] = a;
    d[1] = b[0];
    d[2] = c[1];
    return d;
  }

  // test case 5
  function NoReturnPayable(
    uint256 a,
    string calldata b,
    address c,
    string[] calldata d
  ) public payable {}

  // test case 6
  function ReturnDefault()
    public
    returns (
      uint256,
      string memory,
      address,
      int64[] memory
    )
  {
    stor = 5;
    string memory b = "hello";
    address c = msg.sender;
    int64[] memory d = new int64[](3);
    d[0] = int64(-5);
    d[2] = int64(6);
    return (stor, b, c, d);
  }

  // test case 7
  function ReturnNamedDefault()
    public
    returns (
      uint256 a,
      string memory b,
      address c
    )
  {
    stor = 5;
    a = stor;
    b = string("hello");
    c = msg.sender;
  }

  // test case 8
  function ReturnView()
    public
    view
    returns (
      uint256,
      string memory,
      address,
      bool
    )
  {
    uint256 a = 5;
    string memory b = "hello";
    address c = msg.sender;
    bool d = true;
    return (a, b, c, d);
  }

  function Test1(uint256 a) public {
    if (a > 5) {
      revert();
    }
  }
}
