import React, { useContext, useEffect, useState } from "react";
import { IFunctionParam, StateMutability, IFuncTemplate } from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { Web3Context } from "../../contexts/Context";
import { FunctionInteract } from "../function/FunctionInteract";
import { ContractTemplate } from "./ContractTemplate";
import { decodeUrlParams, generateUrl } from "./urlGenerator";
import { CopyToClipboard } from "../helpers/CopyToClipboard";
import { ImportContract } from "../modals/ImportContract";

interface Params {
  contractData: string;
}

export function ContractInteract(params: Params) {
  const [testNumber, setTestNumber] = useState<number>(0);
  const [contractAddress, setContractAddress] = useState<string>("");
  const [contractUrl, setContractUrl] = useState<string>("");
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xad6d458402f60fd3bd25163575031acdce07538d
  const [functions, setFunctions] = useState<IFuncTemplate[]>([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [waitTxHash, setWaitTxHash] = useState<string>("");
  const [notifyText, setNotifyText] = useState<string>("");
  const [previousTxHash, setPreviousTxHash] = useState<string>("");
  const [showImportModal, setShowImportModal] = useState(false);

  const debug: boolean = false;

  useEffect(() => {
    if (params && params.contractData) {
      try {
        const contractData = decodeUrlParams(params.contractData);
        setContractAddress(contractData.address);
        setFunctions(contractData.functions);
      } catch (ex) {
        setNotifyText("Invalid loaded contract: " + ex);
      }
    }
  }, [params]);

  useEffect(() => {
    setContractUrl("");
  }, [contractAddress, functions]);

  const generateUri = () => {
    const url = generateUrl(contractAddress, functions);
    setContractUrl(url);
  };

  const addEmptyFunction = () => {
    const custom: IFuncTemplate = {
      funcName: "new",
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

  const addFunctions = (newFuncs: IFuncTemplate[]) => {
    const copy = [...functions];
    newFuncs.forEach((func) => copy.push(func));
    setSelectedFunctionIndex(functions.length);
    setFunctions(copy);

    //console.log('setting funcs', copy)
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
    newParam: IFunctionParam,
  ) => {
    const functionsCopy = [...functions];
    const functionItem = { ...functionsCopy[selectedFunctionIndex] };
    functionItem.funcInputParams[paramIndex] = newParam;
    functionsCopy[selectedFunctionIndex] = functionItem;

    setFunctions(functionsCopy);
  };

  const changeFunctionOutputParam = (
    paramIndex: number,
    newParam: IFunctionParam,
  ) => {
    const functionsCopy = [...functions];
    const functionItem = { ...functionsCopy[selectedFunctionIndex] };
    functionItem.funcOutputParams[paramIndex] = newParam;
    functionsCopy[selectedFunctionIndex] = functionItem;

    setFunctions(functionsCopy);
  };

  const getEmptyParam = () => {
    const param: IFunctionParam = {
      unitType: "uint256",
      basicType: "uint",
      value: "",
      /*    staticArraySize: 0, */
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
        <input
          type="button"
          value="Import contract functions"
          onClick={() => {
            setShowImportModal(true);
          }}
        ></input>
      </div>
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
        <input type="button" value="Add new" onClick={addEmptyFunction}></input>
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
          <>
            <fieldset>
              <legend>Function&nbsp;data</legend>

              <FunctionInteract
                setNotifyText={setNotifyText}
                contractAddress={contractAddress}
                setContractAddress={setContractAddress}
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
            </fieldset>
          </>
        )}

      <div>
        <input
          type="button"
          value="Generate shareable URL"
          onClick={generateUri}
        ></input>
        <input type="text" placeholder="" disabled={true} value={contractUrl} />
        <CopyToClipboard textToCopy={contractUrl} />
      </div>

      {previousTxHash && (
        <div>
          <label>Previous transaction hash:</label>
          <input type="text" readOnly value={previousTxHash}></input>
          <CopyToClipboard textToCopy={previousTxHash} />
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
      <ImportContract
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        addFunctions={addFunctions}
        addError={(err) => setNotifyText(err)}
      ></ImportContract>
    </form>
  );
}
