import { BigNumber, BytesLike, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { fillTest } from "../test/tests";
import {
  FunctionParam,
  FuncTypes,
  UnitTypes,
  RawAbiDefinition,
  RawAbiParameter,
  StateMutability,
  ExecutionTypes,
  IFuncTemplate,
} from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { Web3Context } from "../../contexts/Context";
import { FunctionInteract } from "../function/FunctionInteract";
import { ContractTemplate } from "./ContractTemplate";

export function ContractInteract() {
  const [testNumber, setTestNumber] = useState<number>(0);
  const [contractAddress, setContractAddress] = useState<string>("");
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xeb52ce516a8d054a574905bdc3d4a176d3a2d51a
  const [functions, setFunctions] = useState<IFuncTemplate[]>([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [waitTxHash, setWaitTxHash] = useState<string>("");
  const [notifyText, setNotifyText] = useState<string>("");
  const [previousTxHash, setPreviousTxHash] = useState<string>("");

  const debug: boolean = false;

  //console.log("amounts", functions.length, selectedFunctionIndex);

  useEffect(() => {}, []);

  /*   const doTest = (index : number) => {
    setContractAddress('0x5FbDB2315678afecb367f032d93F642f64180aa3');
    fillTest({
        index, 
        setFuncName, 
        setFuncType,
        setFunctionInputParams,
        setFunctionOutputParams,
        execute
      }
  )}

  useEffect(() => {
    if (testNumber > 0) {
      reset();
      doTest(testNumber);
    }    
  }, [testNumber]); */
  /* 

  
  const reset = () => {
    setContractAddress('');
    setFuncName('');
    setFuncType('nonpayable');
    setFunctionInputParams([]);
    setFunctionOutputParams([]);
    setExecType(ExecutionTypes.default);
  } */

  //useEffect(() => {}, [functions]);

  const validate = () => {
    let errors = [];
    if (
      !contractAddress ||
      contractAddress.length != 42 ||
      !contractAddress.startsWith("0x")
    ) {
      errors.push("Invalid contract address");
    }
    if (errors.length > 0) {
      setNotifyText("Validation errors: " + errors.join(", "));
      return false;
    }
    return true;
  };

  const addEmptyFunction = () => {
    const custom: IFuncTemplate = {
      funcName: "custom",
      funcType: "nonpayable",
      funcInputParams: [],
      funcOutputParams: [],
    };
    const copy = [...functions];
    copy.push(custom);
    // Choose the new last function in advance
    setSelectedFunctionIndex(functions.length);
    setFunctions(copy);
  };

  const addTemplateFunctions = (newFuncs: IFuncTemplate[]) => {
    const copy = [...functions];
    newFuncs.forEach((func) => copy.push(func));
    setSelectedFunctionIndex(functions.length);
    setFunctions(copy);
  };

  const removeFunction = () => {
    const copy = [...functions];
    copy.splice(selectedFunctionIndex, 1);
    setSelectedFunctionIndex(0);
    setFunctions(copy);
  };

  const changeFunctionName = (index: number, value: string) => {
    const copy = [...functions];
    const item = { ...copy[index] };
    item.funcName = value;
    copy[index] = item;
    setFunctions(copy);
  };

  const changeFunctionType = (index: number, value: StateMutability) => {
    const copy = [...functions];
    const item = { ...copy[index] };
    item.funcType = value;
    copy[index] = item;
    setFunctions(copy);
  };

  const changeFunctionInputParam = (
    paramIndex: number,
    newParam: FunctionParam,
  ) => {
    const functionsCopy = [...functions];
    const functionItem = { ...functionsCopy[selectedFunctionIndex] };
    functionItem.funcInputParams[paramIndex] = newParam;
    functionsCopy[selectedFunctionIndex] = functionItem;

    setFunctions(functionsCopy);
  };

  const changeFunctionOutputParam = (
    paramIndex: number,
    newParam: FunctionParam,
  ) => {
    const functionsCopy = [...functions];
    const functionItem = { ...functionsCopy[selectedFunctionIndex] };
    functionItem.funcOutputParams[paramIndex] = newParam;
    functionsCopy[selectedFunctionIndex] = functionItem;

    setFunctions(functionsCopy);
  };

  const getEmptyParam = () => {
    const param: FunctionParam = {
      unitType: "uint",
      value: "",
    };
    return param;
  };

  const addFunctionInputParam = () => {
    const functionsCopy = [...functions];
    const functionCopy = { ...functionsCopy[selectedFunctionIndex] };
    functionCopy.funcInputParams.push(getEmptyParam());

    functionsCopy[selectedFunctionIndex] = functionCopy;
    setFunctions(functionsCopy);
  };

  const addFunctionOutputParam = () => {
    const functionsCopy = [...functions];
    const functionCopy = { ...functionsCopy[selectedFunctionIndex] };
    functionCopy.funcOutputParams.push(getEmptyParam());

    functionsCopy[selectedFunctionIndex] = functionCopy;
    setFunctions(functionsCopy);
  };

  const removeFunctionInputParam = (index: number) => {
    const paramsCopy = functions[selectedFunctionIndex].funcInputParams.filter(
      (_, i) => i !== index,
    );

    const functionsCopy = [...functions];
    const functionCopy = { ...functionsCopy[selectedFunctionIndex] };
    functionCopy.funcInputParams = paramsCopy;

    functionsCopy[selectedFunctionIndex] = functionCopy;
    setFunctions(functionsCopy);
  };

  const removeFunctionOutputParam = (index: number) => {
    const paramsCopy = functions[selectedFunctionIndex].funcOutputParams.filter(
      (_, i) => i !== index,
    );

    const functionsCopy = [...functions];
    const functionCopy = { ...functionsCopy[selectedFunctionIndex] };
    functionCopy.funcOutputParams = paramsCopy;

    functionsCopy[selectedFunctionIndex] = functionCopy;
    setFunctions(functionsCopy);
  };

  return (
    <form onSubmit={() => {}} id="interact">
      {debug && (
        <div>
          <label>Perform test number:</label>
          <input
            type="text"
            placeholder="Number"
            onChange={(e) => {
              setTestNumber(parseInt(e.target.value));
            }}
            value={testNumber}
          />
        </div>
      )}
      <div>
        <label>Contract address:</label>
        <input
          type="text"
          placeholder="Enter contract address"
          onChange={(e) => {
            setContractAddress(e.target.value);
          }}
          value={contractAddress}
        />
      </div>
      <ContractTemplate
        addTemplateFunctions={addTemplateFunctions}
      ></ContractTemplate>
      <div>
        <label>Select function:</label>
        <select
          onChange={(e) => {
            setSelectedFunctionIndex(+e.target.value);
          }}
          value={selectedFunctionIndex}
        >
          {functions.map((item, i) => {
            return (
              <option key={i} value={i}>
                {item.funcName}
              </option>
            );
          })}
        </select>
        <input
          type="button"
          value="Add custom"
          onClick={addEmptyFunction}
        ></input>
        {functions && functions.length > 0 && (
          <input
            type="button"
            value="Remove selected function"
            onClick={removeFunction}
          ></input>
        )}
      </div>
      {functions &&
        functions.length > 0 &&
        selectedFunctionIndex <= functions.length - 1 && (
          <FunctionInteract
            setNotifyText={setNotifyText}
            contractAddress={contractAddress}
            selectedFunction={functions[selectedFunctionIndex]}
            setSelectedFunctionName={(value) => {
              changeFunctionName(selectedFunctionIndex, value);
            }}
            setSelectedFunctionType={(value) => {
              changeFunctionType(selectedFunctionIndex, value);
            }}
            setSelectedFunctionInputParam={(paramIndex, value) => {
              changeFunctionInputParam(paramIndex, value);
            }}
            setSelectedFunctionOutputParam={(paramIndex, value) => {
              changeFunctionOutputParam(paramIndex, value);
            }}
            addSelectedFunctionInputParam={addFunctionInputParam}
            addSelectedFunctionOutputParam={addFunctionOutputParam}
            removeSelectedFunctionInputParam={removeFunctionInputParam}
            removeSelectedFunctionOutputParam={removeFunctionOutputParam}
            setWaitTxHash={setWaitTxHash}
            setPreviousTxHash={setPreviousTxHash}
          ></FunctionInteract>
        )}

      {previousTxHash && (
        <div>
          <label>Previous transaction hash:</label>
          <input type="text" readOnly value={previousTxHash}></input>
        </div>
      )}
      {notifyText && (
        <Notification
          text={notifyText}
          dismiss={() => setNotifyText(null)}
        ></Notification>
      )}
      {waitTxHash && (
        <WaitingForTransactionMessage
          txHash={waitTxHash}
        ></WaitingForTransactionMessage>
      )}
    </form>
  );
}
