import { ethers } from "ethers";
import React from "react";
import { FunctionParam, UnitTypes } from "../types";

interface Params {
    index : number,
    setFuncName: React.Dispatch<React.SetStateAction<string>>
    setFuncType: React.Dispatch<React.SetStateAction<string>>
    setFunctionInputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    setFunctionOutputParams: React.Dispatch<React.SetStateAction<FunctionParam[]>>
    execute: () => void
}

export const fillTest = (params : Params) => {
    const dummyAddr = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
    switch (params.index) {
      case 1:
        params.setFuncName("NoReturnDefault");
        params.setFuncType("nonpayable");
      break;
      case 2:
        params.setFuncName("NoReturnView");
        params.setFuncType("view");
        params.setFunctionInputParams([
            { unitType: UnitTypes.uint, value: 6 },
            { unitType: UnitTypes.string, value: "hmm" },
            { unitType: UnitTypes.address, value: dummyAddr },
            { unitType: UnitTypes.bytes, value: ethers.utils.toUtf8Bytes("hmm") }
        ])
      break;
/*
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
      */
    }

    const delay = (ms : number) => new Promise(res => setTimeout(res, ms));

    delay(1000); // let the state changes go through. nasty hack.
    //params.execute();
  }