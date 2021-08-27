import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { parseParam } from "../helpers/paramHelper";
import { ParamDetails } from "../modals/ParamDetails";
import { IFunctionParam, UnitTypes, IFuncTemplate } from "../types";

interface Params {
  paramIndex: number;
  funcParam: IFunctionParam;
  selectedFunction: IFuncTemplate;
  setSelectedFunctionParam: (paramIndex: number, value: IFunctionParam) => void;
  addSelectedFunctionParam: () => void;
  removeSelectedFunctionParam: (paramIndex: number) => void;
  displayValue: boolean;
  isInput: boolean;
}

export function FunctionParam(params: Params) {
  const [showParamDetailsModal, setShowParamDetailsModal] = useState(false);

  const setParamType = (index: number, value: string) => {
    //console.log("changing type to", item, value);
const item = parseParam(value);
   /*  item.unitType = value;
    item.staticArraySize = 0;
    if (value.indexOf("[") > -1) {
      item.value = [];

      const arraySizeMatch = value.match(/\[(\d+)\]/);
      //console.log("match", arraySizeMatch);
      if (arraySizeMatch) {
        item.staticArraySize = +arraySizeMatch[1];
      }
      item.basicType = value.replace(/\[.*\]/, "").replace(/\d/g, ""); // remove array and number elements
    } else {
      item.value = "";
      item.basicType = value.replace(/\d/g, ""); // remove number elements
    } */
   /*  console.log(
      "setting unit type",
      item.unitType,
      value,
      item.basicType,
      item.staticArraySize,
    ); */
    params.setSelectedFunctionParam(index, item);
  };

  //
  const setBasicParamType = (index: number, value: string) => {
    let newValue = value;
    if (value.indexOf("int") > -1) {
      newValue = value.replace("int", "int256");
    }
    setParamType(index, newValue);
  };

  const getAllParams = (): IFunctionParam[] => {
    let allParams: IFunctionParam[] = params.selectedFunction.funcInputParams;
    if (!params.isInput) {
      allParams = params.selectedFunction.funcOutputParams;
    }
    return allParams;
  };

  const setParamValue = (index: number, value: any) => {
    //console.log("new value", Array.isArray(value), value);

    const item = { ...[...getAllParams()][index] };
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
    else  */ /*  if (item.unitType.indexOf("[") > -1) {
      item.value = item.value.split(",");
    } */
    //console.log('setting new value', item.value, getAllParams());
    //copy[index] = item;
    params.setSelectedFunctionParam(index, item);
  };

  const getItemValue = (item: IFunctionParam) => {
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

    if (Array.isArray(item.value)) {
      return "[" + item.value.join("; ") + "]";
    }

    return item.value.toString();
  };

  const isArrayType = params.funcParam.unitType.indexOf("[") > -1;

  return (
    <div>
      <label>Parameter {params.paramIndex} base type:</label>
      <select
        onChange={(e) => {
          setBasicParamType(params.paramIndex, e.target.value);
        }}
        value={params.funcParam.basicType}
      >
        {Object.keys(UnitTypes).map((item2, i2) => {
          return (
            <option key={i2} value={UnitTypes[item2]}>
              {UnitTypes[item2]}
            </option>
          );
        })}
      </select>
      <input type='button' value='Details' onClick={() => setShowParamDetailsModal(true)}></input>
      <label hidden={!params.displayValue}>Value:</label>
      {!isArrayType && (
        <input
          type="text"
          onChange={(e) => {
            setParamValue(params.paramIndex, e.target.value);
          }}
          value={getItemValue(params.funcParam)}
          hidden={!params.displayValue}
          disabled={!params.isInput}
        ></input>
      )}
      {isArrayType && (
        <>
          <input
            type="text"
            value={getItemValue(params.funcParam)}
            hidden={!params.displayValue}
            /* disabled={!params.isInput} */
            onClick={() => setShowParamDetailsModal(true)}
            onKeyPress={() => setShowParamDetailsModal(true)}
            onChange={() => {}}
          ></input>
        </>
      )}
      <input
        type="button"
        value="Remove parameter"
        onClick={() => {
          params.removeSelectedFunctionParam(params.paramIndex);
        }}
      ></input>
      <ParamDetails
        show={showParamDetailsModal}
        onHide={() => setShowParamDetailsModal(false)}
        funcParam={params.funcParam}
        paramIndex={params.paramIndex}
        disableInput={!params.isInput}
        setParamType={setParamType}
        setParamValue={setParamValue}
      ></ParamDetails>
    </div>
  );
}
