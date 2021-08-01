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
        params.setFuncName("NoReturnDefault");
        params.setFuncType("nonpayable");
        params.setFunctionInputParams([
            { unitType: 'uint', value: 6 },
            { unitType: 'string', value: 'hmm' },
            { unitType: 'address', value: dummyAddr }
        ]);
      break;
      case 3:
        params.setFuncName("NoReturnView");
        params.setFuncType("view");
      break;
      case 4:
        params.setFuncName("NoReturnView");
        params.setFuncType("view");
        params.setFunctionInputParams([
            { unitType: 'uint', value: 6 },
            { unitType: 'string', value: "hmm" },
            { unitType: 'address', value: dummyAddr }
        ]);
      break;
      case 5:
        params.setFuncName("NoReturnPayable");
        params.setFuncType("payable");
      break;
      case 6:
        params.setFuncName("NoReturnPayable");
        params.setFuncType("payable");
        params.setFunctionInputParams([
            { unitType: 'uint' },
            { unitType: 'string' },
            { unitType: 'address' },
            { unitType: 'string[]' }
        ]);
      break;
      case 7:
        params.setFuncName("ReturnDefault");
        params.setFuncType("nonpayable");
        params.setFunctionOutputParams([
            { unitType: 'uint' },
            { unitType: 'string' },
            { unitType: 'address' },
            { unitType: 'int64[]' }
        ]);
      break;
      case 8:
        params.setFuncName("ReturnNamedDefault");
        params.setFuncType("nonpayable");
        params.setFunctionOutputParams([
            { unitType: 'uint' },
            { unitType: 'string' },
            { unitType: 'address' }
        ]);
      break;
      case 9:
        params.setFuncName("ReturnView");
        params.setFuncType("view");
        params.setFunctionOutputParams([
            { unitType: 'uint' },
            { unitType: 'string' },
            { unitType: 'address' },
            { unitType: 'bool'}
        ]);
      break;
/*       case 10:
        params.setFuncName("ReturnView2");
        params.setFuncType("view");
        params.setFunctionInputParams([
            { unitType: 'bool', value: true },
             { unitType: 'string[]', value: [ 
                ethers.utils.toUtf8Bytes("a")
            ] }, 
            { unitType: 'uint[]', value: [1, 2, 99] } 
        ]); */
      break;
    }
    
    const delay = (ms : number) => new Promise(res => setTimeout(res, ms));

    delay(1000); // let the state changes go through. nasty hack.

    //params.execute();
  }