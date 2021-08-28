import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { IFunctionParam, UnitTypes } from "../types";

interface Props {
  show: boolean;
  onHide: () => void;
  funcParam: IFunctionParam;
  paramIndex: number;
  disableInput: boolean;
  setParamType: (index: number, newType: string) => void;
  setParamValue:  (index: number, value: any) => void;
}

enum ParamTypes {
  Basic,
  DynamicArray,
  StaticArray,
}

export function ParamDetails(props: Props) {

  let paramType = ParamTypes.Basic;

  if (props.funcParam.unitType.indexOf("[") > -1) {
    paramType = ParamTypes.DynamicArray;
  }
  if (props.funcParam.staticArraySize > 0) {
    paramType = ParamTypes.StaticArray;
  }

  let bitAmount = 256;
  if (props.funcParam.basicType === "bytes") {
    bitAmount = 32;
  }
  const bitMatch = props.funcParam.unitType.match(/\w(\d+)/);
  //console.log("type is " + props.funcParam.unitType);
  if (bitMatch) {
    bitAmount = +bitMatch[1];
  }

  const bytesBitOptions = Array.from({ length: 32 }, (e, i) => i + 1);
  const intBitOptions = Array.from({ length: 32 }, (e, i) => (i + 1) * 8);

  const usedBitOptions = props.funcParam.basicType === "bytes" ? bytesBitOptions : intBitOptions;

  const getSignature = (
    type: ParamTypes,
    bitAmount: number,
    basicType: string,
    staticArraySize: number,
  ) => {
    let sig = basicType; //.replace(/\[.*\]/, "").replace(/\d/g, "");
    //console.log("initial sig", sig);
    if (sig.indexOf("int") > -1 || sig === "bytes") {
      sig += bitAmount.toString();
    }
    if (type == ParamTypes.DynamicArray) {
      sig += "[]";
    } else if (type == ParamTypes.StaticArray) {
      sig += "[" + staticArraySize + "]";
    }
    //console.log("generated sig", sig);
    return sig;
  };

  const changeBasicType = (val: string) => {
    const sig = getSignature(
      paramType,
      bitAmount,
      val,
      props.funcParam.staticArraySize,
    );
    props.setParamType(props.paramIndex, sig);
  };

  const changeBitAmount = (val: number) => {
    const sig = getSignature(
      paramType,
      val,
      props.funcParam.basicType,
      props.funcParam.staticArraySize,
    );
    props.setParamType(props.paramIndex, sig);
  };

  const changeArrayType = (val: ParamTypes) => {
    if (val == ParamTypes.Basic || val == ParamTypes.DynamicArray) {
      const sig = getSignature(val, bitAmount, props.funcParam.basicType, 0);
      props.setParamType(props.paramIndex, sig);
    } else if (val == ParamTypes.StaticArray) {
      const sig = getSignature(val, bitAmount, props.funcParam.basicType, 1);
      props.setParamType(props.paramIndex, sig);
    }
  };

  const changeArrayStaticSize = (valStr: string) => {
    if (+valStr > 0) {
      const sig = getSignature(
        ParamTypes.StaticArray,
        bitAmount,
        props.funcParam.basicType,
        +valStr,
      );
      props.setParamType(props.paramIndex, sig);
    } else {
      const sig = getSignature(
        ParamTypes.DynamicArray,
        bitAmount,
        props.funcParam.basicType,
        0,
      );
      props.setParamType(props.paramIndex, sig);
    }
  };

  const signature = getSignature(
    paramType,
    bitAmount,
    props.funcParam.basicType,
    props.funcParam.staticArraySize,
  );

  const onAddValue = () => {
    const copy = [...props.funcParam.value];
    copy.push("");
    props.setParamValue(props.paramIndex, copy);
  };

  const onRemoveValue = (itemIndex: number) => {
    const copy = props.funcParam.value.filter((_, i) => i !== itemIndex);
    props.setParamValue(props.paramIndex, copy);
  };

  const onChangeValue = (newValue: string, itemIndex: number) => {
    const copy = [...props.funcParam.value];
    copy[itemIndex] = newValue;
    if (paramType == ParamTypes.Basic) {
      props.setParamValue(props.paramIndex, newValue);
    }
    else {
      props.setParamValue(props.paramIndex, copy);
    }
//console.log('sending value', copy, newValue, itemIndex)
    
  };

  let values = props.funcParam.value;
  if (!Array.isArray(values)) {
    values = [values];
  }

  const showBitOptions = props.funcParam.basicType.indexOf("int") > -1 || props.funcParam.basicType === "bytes";
  const modalProps = { onHide: props.onHide, show: props.show };
  //console.log("size is", props.funcParam.staticArraySize);
  return (
    <Modal
      {...modalProps}
      size="lg"
      aria-labelledby="modal-pp"
      centered
      animation={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-pp" className="text-uppercase">
          Define parameter details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <fieldset>
          <legend>Type</legend>
          <div>
          <label>Parameter base type:</label>
          <select
            onChange={(e) => {
              changeBasicType(e.target.value);
            }}
            value={props.funcParam.basicType}
          >
            {Object.keys(UnitTypes).map((item, i) => {
              return (
                <option key={i} value={UnitTypes[item]}>
                  {UnitTypes[item]}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <span>
            <label>Parameter type:</label>
            <input
              type="radio"
              name="paramType"
              onChange={(e) => {
                changeArrayType(ParamTypes.Basic);
              }}
              checked={paramType == ParamTypes.Basic}
            />
            Basic
          </span>
          <span>
            <input
              type="radio"
              name="paramType"
              onChange={(e) => {
                changeArrayType(ParamTypes.DynamicArray);
              }}
              checked={paramType == ParamTypes.DynamicArray}
            />
            Dynamic array
          </span>
          <span>
            <input
              type="radio"
              name="paramType"
              onChange={(e) => {
                changeArrayType(ParamTypes.StaticArray);
              }}
              checked={paramType == ParamTypes.StaticArray}
            />
            Static array with&nbsp;
            <input
              type="text"
              value={
                props.funcParam.staticArraySize > 0
                  ? props.funcParam.staticArraySize
                  : ""
              }
              placeholder={"num"}
              onChange={(e) => changeArrayStaticSize(e.target.value)}
              style={{ width: "50px" }}
            ></input>
            <label>items</label>
          </span>
        </div>
        {showBitOptions &&
        <div>
          <label>Number of bits:</label>
          <select
            onChange={(e) => {
              changeBitAmount(+e.target.value);
            }}
            value={bitAmount}
/*             disabled={props.funcParam.basicType.indexOf("int") == -1} */
          >
            {usedBitOptions.map((item, i) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        }
        <div>
          <label>Parameter signature:</label>
          <input type="text" value={signature} disabled={true}></input>
        </div>
        </fieldset>
       <fieldset>
         <legend>Value</legend>         
         <div>
          {values.map((item, itemIndex) => {
            return (
              <span key={itemIndex}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => onChangeValue(e.target.value, itemIndex)}
                  disabled={props.disableInput}
                ></input>
                {paramType !== ParamTypes.Basic &&
                <Button
                  onClick={(e) => onRemoveValue(itemIndex)}
                  hidden={props.disableInput}
                >
                  Remove value
                </Button>
                } 
              </span>
            );
          })}
        </div>
        {paramType !== ParamTypes.Basic &&
        <div>
          <Button onClick={onAddValue} hidden={props.disableInput}>
            Add value
          </Button>
        </div>        }   
       </fieldset>     
       
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
