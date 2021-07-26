import { BytesLike, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { fillTest } from "../test/tests";
import { FunctionParam, FuncTypes, UnitTypes, RawAbiDefinition, RawAbiParameter, StateMutability, ExecutionTypes } from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";

export function ContractInteract() {
  const [testNumber, setTestNumber] = useState<number>(0);
  const [contractAddress, setContractAddress] = useState<string>('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xeb52ce516a8d054a574905bdc3d4a176d3a2d51a
  const [funcName, setFuncName] = useState<string>('');
  const [funcType, setFuncType] = useState<StateMutability>('nonpayable');
  const [execType, setExecType] = useState<ExecutionTypes>(ExecutionTypes.default);
  const [funcSignature, setFuncSignature] = useState<string>('');
  const [functionInputParams, setFunctionInputParams] = useState<FunctionParam[]>([]);
  const [functionOutputParams, setFunctionOutputParams] = useState<FunctionParam[]>([]);
  const [waitTxHash, setWaitTxHash] = useState<string>('');
  const [previousTxHash, setPreviousTxHash] = useState<string>('');

  const doTest = (index : number) => {
    setContractAddress('0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6');
    fillTest({
        index, 
        setFuncName, 
        setFuncType,
        setFunctionInputParams,
        setFunctionOutputParams,
        execute
      }
  )}

/*   useEffect(() => {
    doTest(testNumber);
  }, []); */

  useEffect(() => {
    if (testNumber > 0) {
      doTest(testNumber);
    }
    
  }, [testNumber]);

  const updateSig = () => {
    let sig = funcName.split(' ')[0]; // ignore all after space
    const addParam = (params : FunctionParam[]) => {
      let inSig = '';
      inSig += '(';
      let paramTypes = [];
      params.forEach((item) => {
        paramTypes.push(item.unitType);
      });
      inSig += paramTypes.flat();
      inSig += ')';
      return inSig;
    }
    
    sig += addParam(functionInputParams);
    if (funcType != 'nonpayable') {
      sig += ' ' + funcType;
    }
    sig += ' returns ';
    sig += addParam(functionOutputParams);


    setFuncSignature(sig);
  }

  const addInputParam = () =>{
    const newParam : FunctionParam = {
      unitType : UnitTypes.string,
      value: ''
    };
    setFunctionInputParams([
      ...functionInputParams,
      newParam
    ]);
  }

  const removeInputParam = (index : number) => {
    const copy = functionInputParams.filter((_, i) => i !== index);
    setFunctionInputParams(copy);
  }

  const addOutputParam = () =>{
    const newParam : FunctionParam = {
      unitType : UnitTypes.string,
      value: ''
    };
    setFunctionOutputParams([
      ...functionOutputParams,
      newParam
    ]);
  }

  const removeOutputParam = (index : number) => {
    const copy = functionOutputParams.filter((_, i) => i !== index);
    setFunctionOutputParams(copy);
  }

  useEffect(() => {
    updateSig();
  }, [functionInputParams, functionOutputParams, funcName, funcType]);

  const changeInputParam = (index, newType) => {
    const copy = [...functionInputParams];
    const item = {...copy[index]};
    item.unitType = newType;
    copy[index] = item;
    setFunctionInputParams(copy);
  }

  const changeOutputParam = (index, newType) => {
    const copy = [...functionOutputParams];
    const item = {...copy[index]};
    item.unitType = newType;
    copy[index] = item;
    setFunctionOutputParams(copy);
  }

  const setInputParamValue = (index, value) => {
    const copy = [...functionInputParams];
    const item = {...copy[index]};
    item.value = value;
    copy[index] = item;
    setFunctionInputParams(copy);
  }

/*   const setOutputParamValue = (index, value) => {
    const copy = [...functionOutputParams];
    const item = {...copy[index]};
    item.value = value;
    copy[index] = item;
    setFunctionOutputParams(copy);
  } */

  const canHaveOutput = (execType == ExecutionTypes.default && (funcType == "pure" || funcType == "view")) ||
  execType == ExecutionTypes.local;

  const execute = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const inputParams : RawAbiParameter[] = [];
    functionInputParams.forEach((item) => {
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

    const contract = new ethers.Contract(
      contractAddress,
      JSON.stringify([abi]),
      provider.getSigner(0),
    );

    const inputValues = functionInputParams.map((param, i) => { 
      return param.value;
    });
    console.log('inputting', inputValues);
    try {
      const res = await contract.functions[funcName](...inputValues);
      if (res.wait) { // It's a real transaction
        setWaitTxHash(res.hash);
        setPreviousTxHash(res.hash);
        console.log('awaiting tx', res);
        await res.wait();   
        setWaitTxHash(null);   
        // non-constant function return values can't be received directly, so don't even try
        return;
      }

      const copy = [...functionOutputParams];
      for (let index = 0; index < functionOutputParams.length; index++) {
        //setOutputParamValue(i, res[i]);      
        const item = {...copy[index]};
        item.value = res[index];
        copy[index] = item;    
      }
      setFunctionOutputParams(copy);
      console.log('result', res, res.toString());
    }
    catch (ex) {
      console.error(ex);
    }

    
  }

  const getItemValue = (item : FunctionParam) => {
    if (!item.value) {
      return '';
    }
    if (item.unitType == UnitTypes.bytes) {
      return ethers.utils.toUtf8String(item.value as BytesLike);
    }
    return item.value.toString();
  }



  return (
    <form onSubmit={() => {}}>
      <div>
        <label>Perform test number</label>
        <input
          type="text" 
          placeholder="Number" 
          onChange={(e) => { setTestNumber(parseInt(e.target.value)) }}
          value={testNumber}       
        />
      </div>
      <div>
        <label>Contract address</label>
        <input
          type="text" 
          placeholder="Enter contract address" 
          onChange={(e) => { setContractAddress(e.target.value) }}
          value={contractAddress}       
        />
      </div>
      <div>
        <label>Function name</label>
        <input
          type="text" 
          placeholder="Enter function name" 
          onChange={(e) => { setFuncName(e.target.value) }}
          value={funcName}       
        />
      </div>
      <div>
        <label>Function type: </label>
        {Object.keys(FuncTypes).filter(k => Number.isNaN(+k)).map((item, i) => {
          return (
            <span key={i}>
            <input            
              type="radio" 
              name="funcType"
              onChange={(e) => { setFuncType(e.target.value as StateMutability) }}
              value={item}     
              checked={item == funcType}
            />
              {item == 'nonpayable' ? 'default' : item}
            </span>
          )})}        
      </div>
      <div>
        <label>Execution type: </label>
        {Object.keys(ExecutionTypes).map((item, i) => {
          return (
            <span key={i}>
            <input            
              type="radio" 
              name="tranType"
              onChange={(e) => { setExecType(ExecutionTypes[e.target.value]) }}
              value={item}     
              checked={ExecutionTypes[item] == execType}
            />
              {ExecutionTypes[item]}
            </span>
          )})}        
      </div>
      <div>
        <label>Function signature</label>
        <input
          type="text" 
          style={{ width: '500px'}}
          disabled={true}
          placeholder="Enter signature" 
          onChange={(e) => { setFuncSignature(e.target.value) }}
          value={funcSignature}    
        />
      </div>
      
      <div>
        <input type="button" value='Add input parameter' onClick={addInputParam}></input>
      </div>
      <div>
        {functionInputParams.map((item, i) => { 
          //console.log('found item', item)
          return (
          <div key={i}>
            <label>Input parameter {i} type:</label>
            <select onChange={(e) => { changeInputParam(i, e.target.value) }} value={item.unitType}>
              {Object.keys(UnitTypes).map((item2, i2) => {
                return (
                <option key={i2} value={UnitTypes[item2]}>{item2}</option>
                )})}
          
            </select>
            <label>Value:</label>
            <input type="text" onChange={(e) => { setInputParamValue(i, e.target.value) }} value={getItemValue(item)}></input>
            <input type="button" value='Remove' onClick={() => { removeInputParam(i); }}></input>
          </div>
        )})}
      
      </div>
      <div>
        <input type="button" value='Add output parameter' onClick={addOutputParam}></input>
      </div>
      <div>
        {functionOutputParams.map((item, i) => { 
          //console.log('output', item)
          return (
          <div key={i}>
            <label>Output parameter {i} type:</label>
            <select onChange={(e) => { changeOutputParam(i, e.target.value) }} value={item.unitType}>
              {Object.keys(UnitTypes).map((item2, i2) => {
                return (
                  <option key={i2} value={UnitTypes[item2]}>{item2}</option>
                )})}
          
            </select>
            <label>Result value:</label>
            {canHaveOutput && <input type="text" disabled={true} value={getItemValue(item)}></input>}
            <input type="button" value='Remove' onClick={() => { removeOutputParam(i); }}></input>
          </div>
        )})}
      </div>
      <div>
        <input type="button" value='Execute' onClick={execute}></input>
      </div>
      {previousTxHash &&
        <div>
        <label>Previous transaction hash:</label>
        <input type="text" readOnly value={previousTxHash}></input>
      </div>
      }      
      {waitTxHash && <WaitingForTransactionMessage txHash={waitTxHash}></WaitingForTransactionMessage> }
    </form>
    
  );
}
