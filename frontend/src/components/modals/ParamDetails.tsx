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
  setParamArrayStaticity: (index: number, staticSize: number) => void;
}

enum ParamTypes {
  Basic,
  DynamicArray,
  StaticArray,
}

export function ParamDetails(props: Props) {
  /*   const [bitAmount, setBitAmount] = useState<number>(256); */
  /*  const [baseType, setBaseType] = useState<string>("uint256");
  
  const [paramType, setParamType] = useState<ParamTypes>(ParamTypes.Basic);
  const [arrayStaticSize, setArrayStaticSize] = useState<number>(0); */

  /*   useEffect(() => {
    updateUpstreamType();
  }, [baseType , bitAmount, paramType, arrayStaticSize ]); */

  let paramType = ParamTypes.Basic;

  if (props.funcParam.unitType.indexOf("[") > -1) {
    paramType = ParamTypes.DynamicArray;
  }
  if (props.funcParam.staticArraySize > 0) {
    paramType = ParamTypes.StaticArray;
  }

  let bitAmount = 256;
  const bitMatch = props.funcParam.unitType.match(/\w(\d+)/);
  console.log("type is " + props.funcParam.unitType);
  if (bitMatch) {
    bitAmount = +bitMatch[1];
  }

  /*   let staticArraySize = 0;
  const arraySizeMatch = props.funcParam.unitType.match(/\[(\d+)\]/);
  if (arraySizeMatch) {
    staticArraySize = +arraySizeMatch[1];
  } */
  console.log(
    "incoming data",
    paramType,
    bitAmount,
    props.funcParam.staticArraySize,
  );
  /*  console.log(
    "have tpye",
    paramType,
    props.funcParam.unitType,
    props.funcParam.staticArraySize,
  ); */

  //const bytesBitOptions = Array.from({ length: 32 }, (e, i) => i + 1);
  const intBitOptions = Array.from({ length: 32 }, (e, i) => (i + 1) * 8);

  /*   const onChangeValue = (newValue: string, itemIndex: number) => {
    const copy = [...props.funcParam.value];
    copy[itemIndex] = newValue;

    props.setParamValue(props.paramIndex, copy);
  };
*/

  const updateUpstreamType = () => {
    /*     const sig = getSignature(paramType);
    props.setParamType(props.paramIndex, sig); */
  };

  const getSignature = (
    type: ParamTypes,
    bitAmount: number,
    basicType: string,
    staticArraySize: number,
  ) => {
    let sig = basicType; //.replace(/\[.*\]/, "").replace(/\d/g, "");
    //console.log("initial sig", sig);
    if (sig.indexOf("int") > -1) {
      sig += bitAmount.toString();
    }
    if (type == ParamTypes.DynamicArray) {
      sig += "[]";
    } else if (type == ParamTypes.StaticArray) {
      sig += "[" + staticArraySize + "]";
    }
    console.log("generated sig", sig);
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
      //props.setParamArrayStaticity(props.paramIndex, 0);
    } else if (val == ParamTypes.StaticArray) {
      const sig = getSignature(val, bitAmount, props.funcParam.basicType, 1);
      props.setParamType(props.paramIndex, sig);
      //props.setParamArrayStaticity(props.paramIndex, 0);
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

  /*  const changeParamType = (type: ParamTypes) => {
    if (type == ParamTypes.Basic) {
      props.setParamArrayStaticity(props.paramIndex, 0);
    }
    if (type == ParamTypes.DynamicArray) {
      props.setParamArrayStaticity(props.paramIndex, 0);
    } else if (type == ParamTypes.StaticArray) {
      props.setParamArrayStaticity(props.paramIndex, 1); // default value is 1
    }
    const newType = getSignature(type);
    props.setParamType(props.paramIndex, newType);
  };

   */

  const signature = getSignature(
    paramType,
    bitAmount,
    props.funcParam.basicType,
    props.funcParam.staticArraySize,
  );

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
          Define parameter type details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label>Parameter base type:</label>
          <select
            onChange={(e) => {
              changeBasicType(e.target.value);
            }}
            value={props.funcParam.basicType}
          >
            {Object.keys(UnitTypes).map((item2, i2) => {
              return (
                <option key={i2} value={UnitTypes[item2]}>
                  {UnitTypes[item2]}
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
              /*    value={"0"} */
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
              /*         value={"0"} */
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
              /*    value={"1"} */
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
              disabled={props.disableInput}
              style={{ width: "50px" }}
            ></input>
            <label>items</label>
          </span>
        </div>
        <div>
          <label>Number of bits:</label>
          <select
            onChange={(e) => {
              changeBitAmount(+e.target.value);
            }}
            value={bitAmount}
            disabled={props.funcParam.basicType.indexOf("int") == -1}
          >
            {intBitOptions.map((item, i) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label>Parameter signature:</label>
          <input type="text" value={signature} disabled={true}></input>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
