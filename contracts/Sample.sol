// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Sample {
  uint256 stor;

  function Case1() public {}

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~f-('n!'Case2'~.nonpayable'~i-('.uint256*string*address')]~o-])])*'),('.-![.t!'.-*_
  function Case2(
    uint256 a,
    string calldata b,
    address c
  ) public {}

  // test case 3
  function Case3(uint256[] calldata a)
    public
    pure
    returns (uint256[] calldata)
  {
    return (a);
  }

uint totalValue;

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~f-('n!'CaseP*t!'p*i-]~o-('t!'uint256[]')])])*ayable'~-![-*_
  function CasePayable()
    public
    payable
  {
    totalValue += msg.value;
  }

  function CheckValue() public view returns (uint) {
    return totalValue;
  }

  function Case5(uint256[2] memory a) public pure returns (uint256[] memory) {
    uint256[] memory d = new uint256[](3);
    d[0] = uint256(5);
    d[2] = uint256(a[1]);
    return d;
  }

  // http://localhost:3000/load/('aE0x5FbDB2315678afecb367f032d93F642f64180aa3'~f.('nECase6'~tEpure'~i.*1')G2[-G3[2A~o.*32[A)])*('tEbytesA').![A-]E!'G,*GEA.-*_
  // input 0x12, [0x1234, 0x3456] and [0xabcdef, 0x987654]. output [0x12..., 0x1234..., 0x987654...]
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

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~fA('n!'Case7'~t!'pure'~i-3][][1]'),*'.~o-]'..)*('t!'uint256-A*[.)]A![A.-*_
// input [[1,2,3],[4,5,6]] and 1, return 6,5,0
  function Case7(uint256[3][][1] memory arr, uint basic) public pure returns(uint256[] memory) {
      uint256[] memory d = new uint256[](3);
      d[0] = arr[0][1][2];
      d[1] = arr[0][basic][1];
      return d;
  }

  // http://localhost:3000/load/('aC0x5FbDB2315678afecb367f032d93F642f64180aa3'~f.('nCNoReturnP-tCp-i.Euint256A*addressA[]')]~o.])])*'),E-ayable'~.![A*stringC!'E('tCECA.-*_
  function NoReturnPayable(
    uint256 a,
    string calldata b,
    address c,
    string[] calldata d
  ) public payable {}

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~f-('n!'SimpleP*t!'p*i.~o.)])*ayable'~-![.-].-*_
  function SimplePayable() public payable {}

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

  // http://localhost:3000/load/('a.0x5FbDB2315678afecb367f032d93F642f64180aa3'~f-('n.ReturnView'~t.view'~i-]~o-Auint256*string*address*bool')])])*'),A-![.!'A('t.A.-*_
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

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~f*('n!'Test1'~t!'pure'~i*('t!'uint256')]~o*])])*![*_
  function Test1(uint256 a) public pure {
    if (a > 5) {
      revert();
    }
  }

// http://localhost:3000/load/('a!'0x5FbDB2315678afecb367f032d93F642f64180aa3'~f*('n!'BoolTest'~t!'pure'~i*('t!'bool')]~o*])])*![*_
  function BoolTest(bool a) public pure {
    if (a) {
      revert("some message");
    }
  }
}
