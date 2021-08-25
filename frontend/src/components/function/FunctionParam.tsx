import React, { useCallback, useContext, useEffect, useState } from "react";
import { IFunctionParam, UnitTypes, IFuncTemplate } from "../types";

interface Params {
  paramIndex: number;
  item: IFunctionParam;
  selectedFunction: IFuncTemplate;
  setSelectedFunctionParam: (paramIndex: number, value: IFunctionParam) => void;
  addSelectedFunctionParam: () => void;
  removeSelectedFunctionParam: (paramIndex: number) => void;
}

export function FunctionParam(params: Params) {
  const setParamType = (index: number, value: string) => {
    const item = { ...[...params.selectedFunction.funcInputParams][index] };
    item.unitType = value;
    params.setSelectedFunctionParam(index, item);
  };

  const setParamValue = (index: number, value: string) => {
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

    return item.value.toString();
  };

  return (
    <div>
      <label>Parameter {params.paramIndex} type:</label>
      <select
        onChange={(e) => {
          setParamType(params.paramIndex, e.target.value);
        }}
        value={params.item.unitType}
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
      {params.item.unitType.indexOf("[]") > -1 && (
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
          setParamValue(params.paramIndex, e.target.value);
        }}
        value={getItemValue(params.item)}
      ></input>
      {params.item.unitType.indexOf("[]") > -1 && (
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
          params.removeSelectedFunctionParam(params.paramIndex);
        }}
      ></input>
    </div>
  );
}
