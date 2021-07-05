import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { RawAbiDefinition, RawAbiParameter } from "./types";

export function ContractInteract() {
  const [contractAddress, setContractAddress] = useState<string>('0x5FbDB2315678afecb367f032d93F642f64180aa3');
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
  }, [functionParams, funcName]);

  const changeParam = (index, newType) => {
    const copy = [...functionParams];
    const item = {...copy[index]};
    item.unitType = newType;
    copy[index] = item;
    setFunctionParams(copy);
  }

  const refContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const params : RawAbiParameter[] = [];
    functionParams.forEach((item) => {
      const para : RawAbiParameter = {
        name: item.name,
        type: item.unitType
      };
      params.push(para);
    });

    const abi : RawAbiDefinition = {
      name: funcName,
      type: 'function',
      inputs: params,
      stateMutability: 'view',
      outputs: [{"name":"hmm","type":"string"}]
    };

    const abi2 = [ {
      "type":"function",
      "inputs": [],
      "name": funcName,
      "outputs": [],
      "stateMutability": "view"
      }];

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
        <label>Function signature</label>
        <input
          type="text" 
          placeholder="Enter signature" 
          onChange={(e) => { setFuncSignature(e.target.value) }}
          value={funcSignature}       
        />
      </div>
      <div>
        <input type="button" value='Doit' onClick={refContract}></input>
      </div>
      <div>
        <input type="button" value='Add parameter' onClick={addParam}></input>
      </div>
      <div>
        {functionParams.map((item, i) => { return (
          <div key={i}>
            <label>Parameter {i} type:</label>
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
