import { BigNumber, BytesLike, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { fillTest } from "../test/tests";
import { FunctionParam, FuncTypes, UnitTypes, RawAbiDefinition, RawAbiParameter, StateMutability, ExecutionTypes } from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { FuncTemplate } from "./FuncTemplate";
import { Web3Context } from "../../contexts/Context";

export function FunctionInteract() {
  const [testNumber, setTestNumber] = useState<number>(0);
  const [useTemplate, setUseTemplate] = useState<boolean>(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xeb52ce516a8d054a574905bdc3d4a176d3a2d51a
  const [funcName, setFuncName] = useState<string>('');
  const [funcType, setFuncType] = useState<StateMutability>('nonpayable');
  const [tranValue, setTranValue] = useState<BigNumber>(BigNumber.from(0));
  const [execType, setExecType] = useState<ExecutionTypes>(ExecutionTypes.default);
  const [funcSignature, setFuncSignature] = useState<string>('');
  const [signatureHash, setSignatureHash] = useState<string>('');
  const [functionInputParams, setFunctionInputParams] = useState<FunctionParam[]>([]);
  const [functionOutputParams, setFunctionOutputParams] = useState<FunctionParam[]>([]);
  const [waitTxHash, setWaitTxHash] = useState<string>('');
  const [notifyText, setNotifyText] = useState<string>('');
  const [previousTxHash, setPreviousTxHash] = useState<string>('');

  const { selectedAddress } = useContext(Web3Context);

  const debug : boolean = false;

  const doTest = (index : number) => {
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
  }, [testNumber]);

  const reset = () => {
    setContractAddress('');
    setFuncName('');
    setFuncType('nonpayable');
    setFunctionInputParams([]);
    setFunctionOutputParams([]);
    setExecType(ExecutionTypes.default);
  }

  
  useEffect(() => {
    updateSig();
  }, [functionInputParams, functionOutputParams, funcName, funcType]);

  const updateSig = () => {
    const funcTrimName = funcName.split(' ')[0]; // ignore all after space
    let sig = funcTrimName;
    const addParam = (params : FunctionParam[]) => {
      let inSig = '';
      let paramTypes = [];
      params.forEach((item) => {
        paramTypes.push(item.unitType);
      });
      inSig += paramTypes.flat();
      return inSig;
    }
    const inputParamsStr = addParam(functionInputParams);
    
    sig += '(' + inputParamsStr + ')';
    if (funcType != 'nonpayable') {
      sig += ' ' + funcType;
    }
    const outputParamsStr = addParam(functionOutputParams);
    if (outputParamsStr && outputParamsStr.length > 0) {
      sig += ' returns (';
      sig += outputParamsStr;
      sig += ')';
    }

    const getFuncSig = () => {
      if (!funcTrimName) {
        return '';
      }
      const abi = getAbi();
      
      let sigHash = null; 
      try {
        let iface = new ethers.utils.Interface(abi);
        sigHash = iface.getSighash(iface.getFunction(funcTrimName));
      }
      catch (ex) {
        setNotifyText('Error in creating function signature, please check your inputs');
        console.error('Unable to create function signature hash', ex);
      }
      return sigHash;
    }
    
    const sigHash = getFuncSig();

    if (sigHash != null) {
      setSignatureHash(sigHash);
      setFuncSignature(sig);
    }
  }

  const addInputParam = () =>{
    const newParam : FunctionParam = {
      unitType : 'string',
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
      unitType : 'string',
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
/*     if (item.unitType.indexOf('bytes') > -1) {
      console.log('new value', value, item)
      if (item.unitType.indexOf('[]') > -1) {
        const rawValues = item.value.split(',');
        const values = rawValues.map(item2 => ethers.utils.toUtf8Bytes(ethers.utils.hexZeroPad(item2, 8)));
        item.value = values;
      }
      else {        
        item.value = ethers.utils.toUtf8Bytes(value);
      }
    }
    else  */if (item.unitType.indexOf('[]') > 0) {
      item.value = item.value.split(',');
    }
    //console.log('setting new value', item.value);
    copy[index] = item;
    setFunctionInputParams(copy);
  }

  const canHaveOutput = (execType == ExecutionTypes.default && (funcType == "pure" || funcType == "view")) ||
    execType == ExecutionTypes.local;

  const getAbi = () : string => {
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
    const abiStr = JSON.stringify([abi]);
    return abiStr;
  }

  const validate = () => {
    let errors = [];
    if (!contractAddress || contractAddress.length != 42 || !contractAddress.startsWith('0x')) {
      errors.push('Invalid contract address');
    }
    if (!funcName || !funcName.match("^[A-Za-z0-9_-]{1,100}")) {
      errors.push('Invalid function name');
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

    const inputValues = functionInputParams.map((param, i) => { 
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
    }
  }

  const getItemValue = (item : FunctionParam) => {
    if (!item.value) {
      return '';
    }
    //console.log('found item', item)
/*     if (item.unitType.indexOf('bytes') > -1) {
      if (item.unitType.indexOf('[]') > -1) {
        const rawValues = item.value as string[];
        const values = rawValues.map(item2 => ethers.utils.toUtf8String(item2 as BytesLike));
        console.log('vallll', values)
        return values;
      }
      return ethers.utils.toUtf8String(item.value as BytesLike);
    } */

    return item.value.toString();
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
      <FuncTemplate
        setFuncName={setFuncName}
        setFuncType={setFuncType}
        setFunctionInputParams={setFunctionInputParams}
        setFunctionOutputParams={setFunctionOutputParams}
        setUseTemplate={setUseTemplate}
      ></FuncTemplate>
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
        <label>Function name:</label>
        <input
          type="text" 
          placeholder="Enter function name" 
          onChange={(e) => { setFuncName(e.target.value) }}
          value={funcName}
          disabled={useTemplate}     
        />
      </div>
      <div>
        <label>Function type: </label>
        {Object.keys(FuncTypes).filter(k => Number.isNaN(+k)).map((item, i) => {
          return (
            <span key={i} className={'myRadio'}>
            <input            
              type="radio" 
              name="funcType"
              onChange={(e) => { setFuncType(e.target.value as StateMutability) }}
              value={item}     
              checked={item == funcType}
              disabled={useTemplate} 
            />
              {item == 'nonpayable' ? 'default' : item}
            </span>
          )})}        
      </div>
      <div>
        <label>Execution type: </label>
        {Object.keys(ExecutionTypes).map((item, i) => {
          return (
            <span key={i} className={'myRadio'}>
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
      {funcType == 'payable' && execType == ExecutionTypes.default &&
        <div>
          <label>Value: </label>
          <input
            type="text" 
            onChange={(e) => { setTranValue(BigNumber.from(e.target.value)) }}
            value={tranValue.toString()}       
        />  
        </div>
      }      
      <div className='box'>
        <div>
          {functionInputParams.map((item, i) => { 
            //console.log('found item', item)
            return (
            <div key={i}>
              <label>Input parameter {i} type:</label>
              <select onChange={(e) => { changeInputParam(i, e.target.value) }} value={item.unitType} disabled={useTemplate} >
                {Object.keys(UnitTypes).map((item2, i2) => {
                  return (
                  <option key={i2} value={UnitTypes[item2]}>{UnitTypes[item2]}</option>
                  )})}
            
              </select>
              <label>Value:</label>
              {(item.unitType.indexOf('[]') > -1) && <input type="text" value='[' disabled={true} style={{width: '15px'}}></input>}
              <input 
                type="text" 
                onChange={(e) => { setInputParamValue(i, e.target.value) }} 
                value={getItemValue(item)}>
                
              </input>
              {(item.unitType.indexOf('[]') > -1) && <input type="text" value=']' disabled={true} style={{width: '15px'}}></input>}
              <input 
                type="button" 
                value='Remove parameter' 
                onClick={() => { removeInputParam(i); }}
                disabled={useTemplate} >
              </input>
            </div>
          )})}      
        </div> 
        <div>
          <input 
            type="button" 
            value='Add input parameter' 
            onClick={addInputParam}
            disabled={useTemplate} 
            ></input>
        </div>   
      </div>
      <div className='box'>
        <div>
          {functionOutputParams.map((item, i) => { 
            return (
            <div key={i}>
              <label>Output parameter {i} type:</label>
              <select onChange={(e) => { changeOutputParam(i, e.target.value) }} value={item.unitType} disabled={useTemplate} >
                {Object.keys(UnitTypes).map((item2, i2) => {
                  return (
                    <option key={i2} value={UnitTypes[item2]}>{UnitTypes[item2]}</option>
                  )})}
            
              </select>
              {canHaveOutput && <label>Result value:</label>}
              {canHaveOutput && (item.unitType.indexOf('[]') > -1) && <input type="text" value='[' disabled={true} style={{width: '15px'}}></input>}
              {canHaveOutput && <input type="text" disabled={true} value={getItemValue(item)}></input>}
              {canHaveOutput && (item.unitType.indexOf('[]') > -1) && <input type="text" value=']' disabled={true} style={{width: '15px'}}></input>}
              <input 
                type="button" 
                value='Remove' 
                onClick={() => { removeOutputParam(i); }}
                disabled={useTemplate} 
                ></input>
            </div>
          )})}
        </div>
        <div>
          <input 
            type="button" 
            value='Add output parameter' 
            onClick={addOutputParam}
            disabled={useTemplate} 
          ></input>
        </div>
      </div> 
      <div>
        <label>Function signature:</label>
        <input
          type="text" 
          style={{ width: '500px'}}
          disabled={true}
          placeholder="Signature" 
          onChange={(e) => { }}
          value={funcSignature}    
        />
        <label>Function hash:</label>
        <input
          type="text" 
          style={{ width: '500px'}}
          disabled={true}
          placeholder="" 
          onChange={(e) => { }}
          value={signatureHash}    
        />
      </div> 
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
