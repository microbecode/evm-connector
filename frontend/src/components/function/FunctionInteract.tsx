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
import { Web3Context } from "../../contexts/Context";
import { CopyToClipboard } from "../helpers/CopyToClipboard";

interface Params {
  setNotifyText: React.Dispatch<React.SetStateAction<string>>;
  contractAddress: string;
  selectedFunction: IFuncTemplate;
  setSelectedFunctionName: (value: string) => void;
  setSelectedFunctionType: (value: StateMutability) => void;
  setSelectedFunctionInputParam: (
    paramIndex: number,
    value: FunctionParam,
  ) => void;
  setSelectedFunctionOutputParam: (
    paramIndex: number,
    value: FunctionParam,
  ) => void;
  addSelectedFunctionInputParam: () => void;
  addSelectedFunctionOutputParam: () => void;
  removeSelectedFunctionInputParam: (paramIndex: number) => void;
  removeSelectedFunctionOutputParam: (paramIndex: number) => void;
  setWaitTxHash: (value: string) => void;
  setPreviousTxHash: (value: string) => void;
}

export function FunctionInteract(params: Params) {
  const [tranValue, setTranValue] = useState<string>("0");
  const [execType, setExecType] = useState<ExecutionTypes>(
    ExecutionTypes.default,
  );
  const [funcSignature, setFuncSignature] = useState<string>("");
  const [signatureHash, setSignatureHash] = useState<string>("");

  const { selectedAddress } = useContext(Web3Context);

  useEffect(() => {}, []);

  useEffect(() => {
    updateSig();
  }, [params.selectedFunction]);

  const getAbi = (): string => {
    const inputParams: RawAbiParameter[] = [];
    params.selectedFunction.funcInputParams.forEach((item) => {
      const para: RawAbiParameter = {
        name: "",
        type: item.unitType,
      };
      inputParams.push(para);
    });

    const outputParams: RawAbiParameter[] = [];
    params.selectedFunction.funcOutputParams.forEach((item) => {
      const para: RawAbiParameter = {
        name: "",
        type: item.unitType,
      };
      outputParams.push(para);
    });

    let useMutability: StateMutability = params.selectedFunction.funcType;
    if (execType == ExecutionTypes.local) {
      useMutability = "view";
    }

    const abi: RawAbiDefinition = {
      name: params.selectedFunction.funcName,
      type: "function",
      inputs: inputParams,
      stateMutability: useMutability,
      outputs: outputParams,
    };
    const abiStr = JSON.stringify([abi]);
    return abiStr;
  };

  const execute = async () => {
    if (!validate()) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const abiStr = getAbi();

    console.log("used abi", abiStr);

    const contract = new ethers.Contract(
      params.contractAddress,
      abiStr,
      provider.getSigner(0),
    );

    //console.log("contract", contract);

    const inputValues = params.selectedFunction.funcInputParams.map(
      (param, i) => {
        //console.log('value for exec', param.value)
        return param.value;
      },
    );
    //console.log("inputting", inputValues, params.selectedFunction);
    try {
      let customValue = BigNumber.from(0);
      if (params.selectedFunction.funcType === "payable") {
        customValue = BigNumber.from(tranValue);
        //console.log('etting val', customValue)
      }

      const res = await contract.functions[params.selectedFunction.funcName](
        ...inputValues,
        { value: customValue },
      );
      console.log("result", res);
      if (res.wait) {
        // It's a real transaction
        params.setWaitTxHash(res.hash);
        params.setPreviousTxHash(res.hash);
        //console.log('awaiting tx', res);
        await res.wait();
        params.setWaitTxHash(null);
        // non-constant function return values can't be received directly, so don't even try
        return;
      }
      //console.log("checking return values", res);
      for (
        let index = 0;
        index < params.selectedFunction.funcOutputParams.length;
        index++
      ) {
        const item = { ...params.selectedFunction.funcOutputParams[index] };
        item.value = res[index];
        params.setSelectedFunctionOutputParam(index, item);
      }
      //console.log('result', res, res.toString());
    } catch (ex) {
      let msg = ex.message;
      if (ex.data?.message) {
        msg += ", " + ex.data.message;
      }
      params.setNotifyText("ERROR: " + msg);
      console.error(ex);
    }
  };

  const getFuncSig = () => {
    if (!params.selectedFunction.funcName) {
      return null;
    }
    const abi = getAbi();

    let sigHash = null;
    try {
      let iface = new ethers.utils.Interface(abi);
      sigHash = iface.getSighash(
        iface.getFunction(params.selectedFunction.funcName),
      );
    } catch (ex) {
      params.setNotifyText(
        "Error in creating function signature, please check your inputs",
      );
      console.error("Unable to create function signature hash", ex);
    }
    return sigHash;
  };

  const updateSig = () => {
    let sig = params.selectedFunction.funcName;
    const addParam = (params: FunctionParam[]) => {
      let inSig = "";
      let paramTypes = [];
      params.forEach((item) => {
        paramTypes.push(item.unitType);
      });
      inSig += paramTypes.flat();
      return inSig;
    };
    const inputParamsStr = addParam(params.selectedFunction.funcInputParams);

    sig += "(" + inputParamsStr + ")";
    if (params.selectedFunction.funcType != "nonpayable") {
      sig += " " + params.selectedFunction.funcType;
    }
    const outputParamsStr = addParam(params.selectedFunction.funcOutputParams);
    if (outputParamsStr && outputParamsStr.length > 0) {
      sig += " returns (";
      sig += outputParamsStr;
      sig += ")";
    }

    const sigHash = getFuncSig();

    if (sigHash != null) {
      setSignatureHash(sigHash);
      setFuncSignature(sig);
    }
  };

  const setInputParamType = (index: number, value: string) => {
    const item = { ...[...params.selectedFunction.funcInputParams][index] };
    item.unitType = value;
    params.setSelectedFunctionInputParam(index, item);
  };

  const setInputParamValue = (index: number, value: string) => {
    //const copy = [...params.selectedFunction.funcInputParams];
    const item = { ...[...params.selectedFunction.funcInputParams][index] };
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
    else  */ if (item.unitType.indexOf("[]") > 0) {
      item.value = item.value.split(",");
    }
    //console.log('setting new value', item.value);
    //copy[index] = item;
    params.setSelectedFunctionInputParam(index, item);
  };

  /*   const setOutputParamValue = (index : number, value : string) => {
    const item = {...[...params.selectedFunction.funcOutputParams][index]};
    item.value = value;
    params.setSelectedFunctionOutputParam(index, item);
  } */

  const setOutputParamType = (index: number, value: string) => {
    const item = { ...[...params.selectedFunction.funcOutputParams][index] };
    item.unitType = value;
    params.setSelectedFunctionOutputParam(index, item);
  };

  const canHaveOutput =
    (execType == ExecutionTypes.default &&
      (params.selectedFunction.funcType == "pure" ||
        params.selectedFunction.funcType == "view")) ||
    execType == ExecutionTypes.local;

  const validate = () => {
    let errors = [];
    if (
      !params.contractAddress ||
      params.contractAddress.length != 42 ||
      !params.contractAddress.startsWith("0x")
    ) {
      errors.push("Invalid contract address");
    }
    if (
      !params.selectedFunction.funcName ||
      !params.selectedFunction.funcName.match("^[A-Za-z0-9_-]{1,100}")
    ) {
      errors.push("Invalid function name");
    }
    if (!tranValue.match("^\\d+$")) {
      errors.push("Invalid transaction value");
    }
    if (getFuncSig() == null) {
      errors.push("Invalid function name");
    }
    if (errors.length > 0) {
      params.setNotifyText("Validation errors: " + errors.join(", "));
      return false;
    }
    return true;
  };

  const getItemValue = (item: FunctionParam) => {
    if (!item.value) {
      return "";
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
  };

  const executeName =
    "Execute on blockchain ID " + window.ethereum?.networkVersion;

  return (
    <div className="functions">
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
          onChange={(e) => {
            params.setSelectedFunctionName(e.target.value);
          }}
          value={params.selectedFunction?.funcName}
        />
      </div>
      <div>
        <label>Function type: &nbsp; </label>
        {Object.keys(FuncTypes)
          .filter((k) => Number.isNaN(+k))
          .map((item, i) => {
            return (
              <span key={i} className={"myRadio"}>
                <input
                  type="radio"
                  name="funcType"
                  onChange={(e) => {
                    params.setSelectedFunctionType(
                      e.target.value as StateMutability,
                    );
                  }}
                  value={item}
                  checked={item == params.selectedFunction?.funcType}
                />
                {item == "nonpayable" ? "default" : item}
              </span>
            );
          })}
      </div>

      {params.selectedFunction.funcType == "payable" &&
        execType == ExecutionTypes.default && (
          <div>
            <label>Value: </label>
            <input
              type="text"
              onChange={(e) => {
                setTranValue(e.target.value);
              }}
              value={tranValue.toString()}
              style={{ width: "200px" }}
            />
            <label>&nbsp;weis</label>
          </div>
        )}
      <div className="box">
        <div>
          {params.selectedFunction.funcInputParams.map((item, i) => {
            //console.log('found item', item)
            return (
              <div key={i}>
                <label>Input parameter {i} type:</label>
                <select
                  onChange={(e) => {
                    setInputParamType(i, e.target.value);
                  }}
                  value={item.unitType}
                >
                  {Object.keys(UnitTypes).map((item2, i2) => {
                    return (
                      <option key={i2} value={UnitTypes[item2]}>
                        {UnitTypes[item2]}
                      </option>
                    );
                  })}
                </select>
                <label>Value:</label>
                {item.unitType.indexOf("[]") > -1 && (
                  <input
                    type="text"
                    value="["
                    disabled={true}
                    style={{ width: "15px" }}
                  ></input>
                )}
                <input
                  type="text"
                  onChange={(e) => {
                    setInputParamValue(i, e.target.value);
                  }}
                  value={getItemValue(item)}
                ></input>
                {item.unitType.indexOf("[]") > -1 && (
                  <input
                    type="text"
                    value="]"
                    disabled={true}
                    style={{ width: "15px" }}
                  ></input>
                )}
                <input
                  type="button"
                  value="Remove parameter"
                  onClick={() => {
                    params.removeSelectedFunctionInputParam(i);
                  }}
                ></input>
              </div>
            );
          })}
        </div>
        <div>
          <input
            type="button"
            value="Add input parameter"
            onClick={params.addSelectedFunctionInputParam}
          ></input>
        </div>
      </div>
      <div className="box">
        <div>
          {params.selectedFunction.funcOutputParams.map((item, i) => {
            return (
              <div key={i}>
                <label>Output parameter {i} type:</label>
                <select
                  onChange={(e) => {
                    setOutputParamType(i, e.target.value);
                  }}
                  value={item.unitType}
                >
                  {Object.keys(UnitTypes).map((item2, i2) => {
                    return (
                      <option key={i2} value={UnitTypes[item2]}>
                        {UnitTypes[item2]}
                      </option>
                    );
                  })}
                </select>
                {canHaveOutput && <label>Result value:</label>}
                {canHaveOutput && item.unitType.indexOf("[]") > -1 && (
                  <input
                    type="text"
                    value="["
                    disabled={true}
                    style={{ width: "15px" }}
                  ></input>
                )}
                {canHaveOutput && (
                  <input
                    type="text"
                    disabled={true}
                    value={getItemValue(item)}
                  ></input>
                )}
                {canHaveOutput && item.unitType.indexOf("[]") > -1 && (
                  <input
                    type="text"
                    value="]"
                    disabled={true}
                    style={{ width: "15px" }}
                  ></input>
                )}
                <input
                  type="button"
                  value="Remove parameter"
                  onClick={() => {
                    params.removeSelectedFunctionOutputParam(i);
                  }}
                ></input>
              </div>
            );
          })}
        </div>
        <div>
          <input
            type="button"
            value="Add output parameter"
            onClick={params.addSelectedFunctionOutputParam}
          ></input>
        </div>
      </div>
      <div>
        <label>Function signature:</label>
        <input
          type="text"
          style={{ width: "500px" }}
          disabled={true}
          placeholder="Signature"
          onChange={(e) => {}}
          value={funcSignature}
        />
        <CopyToClipboard textToCopy={funcSignature} />
        <label>Function hash:</label>
        <input
          type="text"
          style={{ width: "500px" }}
          disabled={true}
          placeholder=""
          onChange={(e) => {}}
          value={signatureHash}
        />
        <CopyToClipboard textToCopy={signatureHash} />
      </div>

      {window.ethereum !== undefined &&
        window.ethereum.networkVersion != null &&
        selectedAddress && (
          <>
            <div>
              <label>Execution type: </label>
              {Object.keys(ExecutionTypes).map((item, i) => {
                return (
                  <span key={i} className={"myRadio"}>
                    <input
                      type="radio"
                      name="tranType"
                      onChange={(e) => {
                        setExecType(ExecutionTypes[e.target.value]);
                      }}
                      value={item}
                      checked={ExecutionTypes[item] == execType}
                    />
                    {ExecutionTypes[item]}
                  </span>
                );
              })}
            </div>
            <div>
              <input
                type="button"
                value={executeName}
                onClick={execute}
              ></input>
            </div>
          </>
        )}
    </div>
  );
}
