import React, { useCallback, useContext, useEffect, useState } from "react";
import { ParamList } from "../modals/ParamList";
import { IFunctionParam, UnitTypes, IFuncTemplate } from "../types";

interface Params {
  paramIndex: number;
  funcParam: IFunctionParam;
  selectedFunction: IFuncTemplate;
  setSelectedFunctionParam: (paramIndex: number, value: IFunctionParam) => void;
  addSelectedFunctionParam: () => void;
  removeSelectedFunctionParam: (paramIndex: number) => void;
  displayValue: boolean;
}

export function FunctionParam(params: Params) {
  const [showListModal, setShowListModal] = useState(false);

  const setParamType = (index: number, value: string) => {
    const item = { ...[...params.selectedFunction.funcInputParams][index] };
    item.unitType = value;
    if (value.indexOf("[")) {
      item.value = [];
    } else {
      item.value = "";
    }
    params.setSelectedFunctionParam(index, item);
  };

  const setParamValue = (index: number, value: any) => {
    console.log("new value", Array.isArray(value), value);
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
    else  */ /*  if (item.unitType.indexOf("[") > -1) {
      item.value = item.value.split(",");
    } */
    //console.log('setting new value', item.value);
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
      return item.value.join("; ");
    }

    return item.value.toString();
  };

  const isArrayType = params.funcParam.unitType.indexOf("[") > -1;

  return (
    <div>
      <label>Parameter {params.paramIndex} type:</label>
      <select
        onChange={(e) => {
          setParamType(params.paramIndex, e.target.value);
        }}
        value={params.funcParam.unitType}
      >
        {Object.keys(UnitTypes).map((item2, i2) => {
          return (
            <option key={i2} value={UnitTypes[item2]}>
              {UnitTypes[item2]}
            </option>
          );
        })}
      </select>
      <label hidden={!params.displayValue}>Value:</label>
      {!isArrayType && (
        <input
          type="text"
          onChange={(e) => {
            setParamValue(params.paramIndex, e.target.value);
          }}
          value={getItemValue(params.funcParam)}
          hidden={!params.displayValue}
        ></input>
      )}
      {isArrayType && (
        <>
          <input
            type="text"
            defaultValue={getItemValue(params.funcParam)}
            hidden={!params.displayValue}
            /*    disabled={true} */
            onSelect={() => setShowListModal(true)}
          ></input>
          <ParamList
            show={showListModal}
            onHide={() => setShowListModal(false)}
            funcParam={params.funcParam}
            paramIndex={params.paramIndex}
            setParamValue={setParamValue}
          ></ParamList>
        </>
      )}
      <input
        type="button"
        value="Remove parameter"
        onClick={() => {
          params.removeSelectedFunctionParam(params.paramIndex);
        }}
      ></input>
    </div>
  );
}
