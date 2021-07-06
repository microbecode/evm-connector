import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { isJSDocOptionalType } from "typescript";
import { RawAbiDefinition, RawAbiParameter, StateMutability } from "./types";

export function ContractInteract() {
  const [contractAddress, setContractAddress] = useState<string>('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [funcName, setFuncName] = useState<string>('');
  const [funcType, setFuncType] = useState<StateMutability>('nonpayable');
  const [funcSignature, setFuncSignature] = useState<string>('');
  const [functionInputParams, setFunctionInputParams] = useState<FunctionParam[]>([]);
  const [functionOutputParams, setFunctionOutputParams] = useState<FunctionParam[]>([]);

  interface FunctionParam {
    unitType : UnitTypes,
    name: string
  }
  enum UnitTypes  {
    string = 'string',
    address = 'address'
  };

  enum FuncTypes {
    nonpayable,
    view,
    pure,
    payable
  }

  const updateSig = () => {
    let sig = funcName;
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
    sig += ' returns ';
    sig += addParam(functionOutputParams);


    setFuncSignature(sig);
  }

  const addInputParam = () =>{
    const newParam : FunctionParam = {
      unitType : UnitTypes.string,
      name: 'enterName'
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
      name: 'enterName'
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
  }, [functionInputParams, functionOutputParams, funcName]);

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

  const changeFuncType = (value : string) => {

  }

  const refContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const inputParams : RawAbiParameter[] = [];
    functionInputParams.forEach((item) => {
      const para : RawAbiParameter = {
        name: item.name,
        type: item.unitType
      };
      inputParams.push(para);
    });

    const outputParams : RawAbiParameter[] = [];
    functionOutputParams.forEach((item) => {
      const para : RawAbiParameter = {
        name: item.name,
        type: item.unitType
      };
      outputParams.push(para);
    });

    const abi : RawAbiDefinition = {
      name: funcName,
      type: 'function',
      inputs: inputParams,
      stateMutability: funcType,
      outputs: outputParams
    };

/*     const abi = [ {
      "type":"function",
      "inputs": [{"name":"a","type":"uint256"}],
      "name":"foo",
      "outputs": [],
      "stateMutability": "view"
      }]; */



    const contract = new ethers.Contract(
      contractAddress,
      JSON.stringify([abi]),
      provider.getSigner(0),
    );

    const res = await contract.name();

    console.log('contract', contract, res);
  }

  return (
    <form onSubmit={() => {}}>
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
              {item}
            </span>
            
            
          )})}
        
      </div>
      <div>
        <label>Function signature</label>
        <input
          type="text" 
          disabled={true}
          placeholder="Enter signature" 
          onChange={(e) => { setFuncSignature(e.target.value) }}
          value={funcSignature}    
             
        />
      </div>
      <div>
        <input type="button" value='Doit' onClick={refContract}></input>
      </div>
      <div>
        <input type="button" value='Add input parameter' onClick={addInputParam}></input>
      </div>
      <div>
        {functionInputParams.map((item, i) => { return (
          <div key={i}>
            <label>Input parameter {i} type:</label>
            <select onChange={(e) => { changeInputParam(i, e.target.value) }}>
              {Object.keys(UnitTypes).map((item2, i2) => {
                return (
                <option key={i2} value={item2}>{item2}</option>
                )})}
          
            </select>
            <input type="button" value='Remove' onClick={() => { removeInputParam(i); }}></input>
          </div>
        )})}
      
      </div>
      <div>
        <input type="button" value='Add output parameter' onClick={addOutputParam}></input>
      </div>
      <div>
        {functionOutputParams.map((item, i) => { return (
          <div key={i}>
            <label>Output parameter {i} type:</label>
            <select onChange={(e) => { changeOutputParam(i, e.target.value) }} value={item.unitType}>
              {Object.keys(UnitTypes).map((item2, i2) => {
                return (
                  <option key={i2} value={item2}>{item2}</option>
                )})}
          
            </select>
            <input type="button" value='Remove' onClick={() => { removeOutputParam(i); }}></input>
          </div>
        )})}
      
      </div>
    </form>
  );
}
