import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Col, Container, Form, Row } from "react-bootstrap";

export function ContractInteract() {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [funcName, setFuncName] = useState<string>('');
  const [funcSignature, setFuncSignature] = useState<string>('');
  const [functionParams, setFunctionParams] = useState<FunctionParam[]>([]);

  interface FunctionParam {
    unitType : UnitTypes,
    name: string
  }
  enum UnitTypes  {
    string = 'string',
    address = 'address'
  };

  const updateSig = () => {
    let sig = funcName + '(';
    let paramTypes = [];
    functionParams.forEach((item) => {
      paramTypes.push(item.unitType);
    });
    sig += paramTypes.flat();
    sig += ')';
    setFuncSignature(sig);
  }

  const addParam = () =>{
    const newParam : FunctionParam = {
      unitType : UnitTypes.string,
      name: 'enterName'
    };
    setFunctionParams([
      ...functionParams,
      newParam
    ]);
  }

  useEffect(() => {
    updateSig();
  }, [functionParams]);

  const changeParam = (index, newType) => {
    const copy = [...functionParams];
    const item = {...copy[index]};
    item.unitType = newType;
    copy[index] = item;
    setFunctionParams(copy);
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
        <label>Function signature</label>
        <input
          type="text" 
          placeholder="Enter signature" 
          onChange={(e) => { setFuncSignature(e.target.value) }}
          value={funcSignature}       
        />
      </div>
      <div>
        <input type="button" value='Add parameter' onClick={addParam}></input>
      </div>
      <div>
        {functionParams.map((item, i) => { return (
          <div key={i}>
            <label>Parameter {i}</label>
            <select onChange={(e) => { changeParam(i, e.target.value) }}>
              {Object.keys(UnitTypes).map((item, i) => {
                return (
                <option key={i} value={item}>{item}</option>
                )})}
          
        </select>
          </div>
        )})}
      
      </div>
    </form>
  );
}
