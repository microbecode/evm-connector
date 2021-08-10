import { BigNumber, BytesLike, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { fillTest } from "../test/tests";
import { FunctionParam, FuncTypes, UnitTypes, RawAbiDefinition, RawAbiParameter, StateMutability, ExecutionTypes, IFuncTemplate } from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { Web3Context } from "../../contexts/Context";
import { FunctionInteract } from "../function/FunctionInteract";

export function ContractInteract() {
  const [testNumber, setTestNumber] = useState<number>(0);
  const [contractAddress, setContractAddress] = useState<string>('');
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xeb52ce516a8d054a574905bdc3d4a176d3a2d51a
  const [functions, setFunctions] = useState<IFuncTemplate[]>([]);
  const [selectedFunctionIndex, setSelectedFunctionIndex] = useState<number>(0);
  const [waitTxHash, setWaitTxHash] = useState<string>('');
  const [notifyText, setNotifyText] = useState<string>('');
  const [previousTxHash, setPreviousTxHash] = useState<string>('');

  const { selectedAddress } = useContext(Web3Context);

  const debug : boolean = false;

  useEffect(() => {

  }, []);

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
  


  const getAbi = () : string => {
    const inputParams : RawAbiParameter[] = [];
   /*  functionInputParams.forEach((item) => {
      const para : RawAbiParameter = {
        name: '',
        type: item.unitType
      };
      inputParams.push(para);
    });

    const outputParams : RawAbiParameter[] = [];
    functionOutputParams.forEach((item) => {
      const para : RawAbiParameter = {
        name: '',
        type: item.unitType
      };
      outputParams.push(para);
    });

    let useMutability : StateMutability = funcType;
    if (execType == ExecutionTypes.local) {
      useMutability = 'view';
    }

    const abi : RawAbiDefinition = {
      name: funcName,
      type: 'function',
      inputs: inputParams,
      stateMutability: useMutability,
      outputs: outputParams
    };
    const abiStr = JSON.stringify([abi]); */
    return "";//abiStr;
  }

  const validate = () => {
    let errors = [];
    if (!contractAddress || contractAddress.length != 42 || !contractAddress.startsWith('0x')) {
      errors.push('Invalid contract address');
    }
    if (errors.length > 0) {
      setNotifyText('Validation errors: ' + errors.join(', '));
      return false;
    }
    return true;
  }

  
  const execute = async () => {
    if (!validate()) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const abiStr = getAbi();

    //console.log('used abi', abiStr)

    const contract = new ethers.Contract(
      contractAddress,
      abiStr,
      provider.getSigner(0),
    );

    //console.log('contract', contract)

    /* const inputValues = functionInputParams.map((param, i) => { 
      //console.log('value for exec', param.value)
      return param.value;
    });
    //console.log('inputting', inputValues);
    try {
      let customValue = BigNumber.from(0);
      if (funcType === 'payable') {
        customValue = tranValue;
        //console.log('etting val', customValue)
      }
      const res = await contract.functions[funcName](...inputValues, { value : customValue });
      if (res.wait) { // It's a real transaction
        setWaitTxHash(res.hash);
        setPreviousTxHash(res.hash);
        //console.log('awaiting tx', res);
        await res.wait();   
        setWaitTxHash(null);   
        // non-constant function return values can't be received directly, so don't even try
        return;
      }
      //console.log('checking return values')
      const copy = [...functionOutputParams];
      for (let index = 0; index < functionOutputParams.length; index++) {
        const item = {...copy[index]};
        item.value = res[index];
        copy[index] = item;    
      }
      setFunctionOutputParams(copy);
      //console.log('result', res, res.toString());
    }
    catch (ex) {
      setNotifyText('ERROR: ' + ex.message);
      console.error(ex);
    } */
  }

  const addFunction = () => {
    const custom : IFuncTemplate = {
        selectionTitle: '',
        funcName: 'custom',
        funcType: 'nonpayable',
        funcInputParams: [],
        funcOutputParams: []
    };

    const copy = [...functions];
    copy.push(custom);
    setFunctions(copy);
  }

  const changeFunctionName = (index: number, value: string) => {
    const copy = [...functions];
    const item = {...copy[index]};
    item.funcName = value;
    copy[index] = item;
    setFunctions(copy);
  }

  const changeFunctionType = (index: number, value: StateMutability) => {
    const copy = [...functions];
    const item = {...copy[index]};
    item.funcType = value;
    copy[index] = item;
    setFunctions(copy);
  }


/*      const changeFunctionParam2 = (
      paramIndex : number, 
      newValue : string, 
      functionProperty : "funcInputParams" | "funcOutputParams", 
      paramProperty : "unitType" | "value"
    ) => {
    const paramsCopy = [...functions[paramIndex][functionProperty]];
    const paramsItem = {...paramsCopy[paramIndex]};
    paramsItem[paramProperty] = newValue;
    paramsCopy[paramIndex] = paramsItem;

    const functionsCopy = [...functions];
    const functionItem = {...functionsCopy[selectedFunctionIndex]};
    functionItem[functionProperty] = paramsCopy;
    functionsCopy[selectedFunctionIndex] = functionItem;

    setFunctions(functionsCopy);
    } */

    const changeFunctionInputParam = (
        paramIndex : number, 
        newParam : FunctionParam
        ) => {
        const functionsCopy = [...functions];
        const functionItem = {...functionsCopy[selectedFunctionIndex]};
        functionItem.funcInputParams[paramIndex] = newParam;
        functionsCopy[selectedFunctionIndex] = functionItem;

        setFunctions(functionsCopy);
    }

    const changeFunctionOutputParam = (
        paramIndex : number, 
        newParam : FunctionParam
        ) => {
        const functionsCopy = [...functions];
        const functionItem = {...functionsCopy[selectedFunctionIndex]};
        functionItem.funcOutputParams[paramIndex] = newParam;
        functionsCopy[selectedFunctionIndex] = functionItem;

        setFunctions(functionsCopy);
    }

    const getEmptyParam = () => {
        const param : FunctionParam = {
            unitType: 'uint',
            value: ''
        }
        return param;
    }

    const addFunctionInputParam = () => {
        const functionsCopy = [...functions];
        const functionCopy = {...functionsCopy[selectedFunctionIndex]};
        functionCopy.funcInputParams.push(getEmptyParam());
        
        functionsCopy[selectedFunctionIndex] = functionCopy; 
        setFunctions(functionsCopy);
    }

    const addFunctionOutputParam = () => {
        const functionsCopy = [...functions];
        const functionCopy = {...functionsCopy[selectedFunctionIndex]};
        functionCopy.funcOutputParams.push(getEmptyParam());
        
        functionsCopy[selectedFunctionIndex] = functionCopy; 
        setFunctions(functionsCopy);
    }

    const removeFunctionInputParam = (index : number) => {
        const paramsCopy = functions[selectedFunctionIndex].funcInputParams.filter((_, i) => i !== index);

        const functionsCopy = [...functions];
        const functionCopy = {...functionsCopy[selectedFunctionIndex]};
        functionCopy.funcInputParams = paramsCopy;
        
        functionsCopy[selectedFunctionIndex] = functionCopy; 
        setFunctions(functionsCopy);
    }

    const removeFunctionOutputParam = (index : number) => {
        const paramsCopy = functions[selectedFunctionIndex].funcOutputParams.filter((_, i) => i !== index);

        const functionsCopy = [...functions];
        const functionCopy = {...functionsCopy[selectedFunctionIndex]};
        functionCopy.funcOutputParams = paramsCopy;
        
        functionsCopy[selectedFunctionIndex] = functionCopy; 
        setFunctions(functionsCopy);
    }

  const executeName = 'Execute on blockchain ID ' + window.ethereum?.networkVersion;

  return (
    <form onSubmit={() => {}} id="interact">
        {debug &&
        <div>
            <label>Perform test number:</label>
            <input
            type="text" 
            placeholder="Number" 
            onChange={(e) => { setTestNumber(parseInt(e.target.value)) }}
            value={testNumber}       
            />
        </div>
        }
        <div>
        <label>Contract address:</label>
        <input
            type="text" 
            placeholder="Enter contract address" 
            onChange={(e) => { setContractAddress(e.target.value) }}
            value={contractAddress}       
        />
        </div>
        <div>
        <label>Use contract template:</label>
        
        </div>
        <div>
            <label>Select function:</label>
            <select onChange={(e) => { setSelectedFunctionIndex(+e.target.value) }} value={selectedFunctionIndex} >
            {functions.map((item, i) => {
                return (
                <option key={i} value={i}>{item.funcName}</option>
                )})}
        
            </select>
            <input type="button" value='Add custom' onClick={addFunction}></input>
        </div>
{functions && functions.length > 0 &&
        <FunctionInteract
            setNotifyText={setNotifyText}
            selectedFunction={functions[selectedFunctionIndex]}
            setSelectedFunctionName={(value) => { changeFunctionName(selectedFunctionIndex, value) }}
            setSelectedFunctionType={(value) => { changeFunctionType(selectedFunctionIndex, value) }}
            setSelectedFunctionInputParam={(paramIndex, value) => { changeFunctionInputParam(paramIndex, value)}}
            setSelectedFunctionOutputParam={(paramIndex, value) => { changeFunctionOutputParam(paramIndex, value)}}
            addSelectedFunctionInputParam={addFunctionInputParam}
            addSelectedFunctionOutputParam={addFunctionOutputParam}
            removeSelectedFunctionInputParam={removeFunctionInputParam}
            removeSelectedFunctionOutputParam={removeFunctionOutputParam}
        ></FunctionInteract>
}

        {window.ethereum !== undefined && window.ethereum.networkVersion != null && selectedAddress &&
        <div>
        <input type="button" value={executeName} onClick={execute}></input>
        </div>}
        {previousTxHash &&
        <div>
        <label>Previous transaction hash:</label>
        <input type="text" readOnly value={previousTxHash}></input>
        </div>
        }      
        {notifyText && <Notification text={notifyText} dismiss={() => setNotifyText(null)}></Notification> }
        {waitTxHash && <WaitingForTransactionMessage txHash={waitTxHash}></WaitingForTransactionMessage> }
    </form>

    );
}