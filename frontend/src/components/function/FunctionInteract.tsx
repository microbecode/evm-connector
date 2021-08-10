import { BigNumber, BytesLike, ethers } from "ethers";
import React, { useContext, useEffect, useState } from "react";
import { fillTest } from "../test/tests";
import { FunctionParam, FuncTypes, UnitTypes, RawAbiDefinition, RawAbiParameter, StateMutability, ExecutionTypes, IFuncTemplate } from "../types";
import { WaitingForTransactionMessage } from "../WaitingForTransactionMessage";
import { Notification } from "../Notification";
import { FuncTemplate } from "./FuncTemplate";
import { Web3Context } from "../../contexts/Context";

interface Params {
  setNotifyText: React.Dispatch<React.SetStateAction<string>>,
  selectedFunction: IFuncTemplate,
  setSelectedFunctionName: (value: string) => void,
  setSelectedFunctionType: (value: StateMutability) => void,
  setSelectedFunctionInputParam: (paramIndex: number, value: FunctionParam) => void,
  setSelectedFunctionOutputParam: (paramIndex: number, value: FunctionParam) => void,
  addSelectedFunctionInputParam: () => void,
  addSelectedFunctionOutputParam: () => void,
  removeSelectedFunctionInputParam: (paramIndex: number) => void,
  removeSelectedFunctionOutputParam: (paramIndex: number) => void
}

export function FunctionInteract(params : Params) {
  const [useTemplate, setUseTemplate] = useState<boolean>(false);
  //const [contractAddress, setContractAddress] = useState<string>('0xad6d458402f60fd3bd25163575031acdce07538d');
  // ropsten balance of 0xeb52ce516a8d054a574905bdc3d4a176d3a2d51a
/*   const [funcName, setFuncName] = useState<string>('');
  const [funcType, setFuncType] = useState<StateMutability>('nonpayable');*/
  const [tranValue, setTranValue] = useState<BigNumber>(BigNumber.from(0));
  const [execType, setExecType] = useState<ExecutionTypes>(ExecutionTypes.default); 
  const [funcSignature, setFuncSignature] = useState<string>('');
  const [signatureHash, setSignatureHash] = useState<string>('');
 /*  const [functionInputParams, setFunctionInputParams] = useState<FunctionParam[]>([]);
  const [functionOutputParams, setFunctionOutputParams] = useState<FunctionParam[]>([]); */
  
  useEffect(() => {
    
  }, []);

  useEffect(() => {
    //updateSig();
  }, [params.selectedFunction]);

  const updateSig = () => {
    const funcTrimName = params.selectedFunction.funcName.split(' ')[0]; // ignore all after space
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
    const inputParamsStr = addParam(params.selectedFunction.funcInputParams);
    
    sig += '(' + inputParamsStr + ')';
    if (params.selectedFunction.funcType != 'nonpayable') {
      sig += ' ' + params.selectedFunction.funcType;
    }
    const outputParamsStr = addParam(params.selectedFunction.funcOutputParams);
    if (outputParamsStr && outputParamsStr.length > 0) {
      sig += ' returns (';
      sig += outputParamsStr;
      sig += ')';
    }

    /* const getFuncSig = () => {
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
      //setFuncSignature(sig);
    }
    */
    setFuncSignature(sig);
  }

  const removeInputParam = (index : number) => {
/*     const copy = params.selectedFunction.funcInputParams.filter((_, i) => i !== index);
    params.setSelectedFunctionInputParams(copy); */
  }
 
  const removeOutputParam = (index : number) => {
/*     const copy = params.selectedFunction.funcOutputParams.filter((_, i) => i !== index);
    params.setSelectedFunctionOutputParams(copy); */
  }


 /*  const changeInputParam = (index, newType) => {
    const copy = [...params.selectedFunction.funcInputParams];
    const item = {...copy[index]};
    item.unitType = newType;
    copy[index] = item;
    params.setSelectedFunctionInputParams(copy);
  }
 */

  const setInputParamType = (index : number, value : string) => {
    const item = {...[...params.selectedFunction.funcInputParams][index]};
    item.unitType = value;
    params.setSelectedFunctionInputParam(index, item);
  }

  const setInputParamValue = (index : number, value : string) => {
    //const copy = [...params.selectedFunction.funcInputParams];
    const item = {...[...params.selectedFunction.funcInputParams][index]};
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
    //copy[index] = item;
    params.setSelectedFunctionInputParam(index, item);
  }

  const setOutputParamValue = (index : number, value : string) => {
    const item = {...[...params.selectedFunction.funcOutputParams][index]};
    item.value = value;
    params.setSelectedFunctionOutputParam(index, item);
  }

  const setOutputParamType = (index : number, value : string) => {
    const item = {...[...params.selectedFunction.funcOutputParams][index]};
    item.unitType = value;
    params.setSelectedFunctionOutputParam(index, item);
  }

  const canHaveOutput = (execType == ExecutionTypes.default && 
    (params.selectedFunction.funcType == "pure" || params.selectedFunction.funcType == "view")) ||
    execType == ExecutionTypes.local;


  const validate = () => {
    let errors = [];
    if (!params.selectedFunction.funcName || !params.selectedFunction.funcName.match("^[A-Za-z0-9_-]{1,100}")) {
      errors.push('Invalid function name');
    }
    if (errors.length > 0) {
      params.setNotifyText('Validation errors: ' + errors.join(', '));
      return false;
    }
    return true;
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

  

  return (
    <>
    {/*   <FuncTemplate
        setFuncName={setFuncName}
        setFuncType={setFuncType}
        setFunctionInputParams={setFunctionInputParams}
        setFunctionOutputParams={setFunctionOutputParams}
        setUseTemplate={setUseTemplate}
      ></FuncTemplate> */}
      <div>
        <label>Function name:</label>
        <input
          type="text" 
          placeholder="Enter function name" 
          onChange={(e) => { params.setSelectedFunctionName(e.target.value) }}
          value={params.selectedFunction?.funcName}
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
              onChange={(e) => { params.setSelectedFunctionType(e.target.value as StateMutability) }}
              value={item}     
              checked={item == params.selectedFunction?.funcType}
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
      {params.selectedFunction.funcType == 'payable' && execType == ExecutionTypes.default &&
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
          {params.selectedFunction.funcInputParams.map((item, i) => { 
            //console.log('found item', item)
            return (
            <div key={i}>
              <label>Input parameter {i} type:</label>
              <select onChange={(e) => { setInputParamType(i, e.target.value) }} value={item.unitType} disabled={useTemplate} >
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
                onClick={() => { params.removeSelectedFunctionInputParam(i); }}
                disabled={useTemplate} >
              </input>
            </div>
          )})}      
        </div> 
        <div>
          <input 
            type="button" 
            value='Add input parameter' 
            onClick={params.addSelectedFunctionInputParam}
            disabled={useTemplate} 
            ></input>
        </div>   
      </div>
      <div className='box'>
        <div>
          {params.selectedFunction.funcOutputParams.map((item, i) => { 
            return (
            <div key={i}>
              <label>Output parameter {i} type:</label>
              <select onChange={(e) => { setOutputParamType(i, e.target.value) }} value={item.unitType} disabled={useTemplate} >
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
                onClick={() => { params.removeSelectedFunctionOutputParam(i); }}
                disabled={useTemplate} 
                ></input>
            </div>
          )})}
        </div>
        <div>
          <input 
            type="button" 
            value='Add output parameter' 
            onClick={params.addSelectedFunctionOutputParam}
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
    
    </>
  );
}
