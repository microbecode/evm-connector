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
  setParamValue: (index: number, value: any) => void;
}

enum ParamTypes {
  Basic,
  Array,
}

interface IArrayType {
  isDynamic: boolean;
  staticSize: number;
}

export function ParamDetails(props: Props) {
  let paramType = ParamTypes.Basic;

  if (props.funcParam.unitType.indexOf("[") > -1) {
    paramType = ParamTypes.Array;
  }

  const defaultBitAmountBytes = 32;
  const defaultBitAmountInt = 256;
  const bytesBitOptions = Array.from({ length: 32 }, (e, i) => i + 1);
  const intBitOptions = Array.from({ length: 32 }, (e, i) => (i + 1) * 8);

  let bitAmount = defaultBitAmountInt;
  if (props.funcParam.basicType === "bytes") {
    bitAmount = defaultBitAmountBytes;
  }
  const bitMatch = props.funcParam.unitType.match(/\w(\d+)/);
  //console.log("type is " + props.funcParam.unitType);
  if (bitMatch) {
    bitAmount = +bitMatch[1];
  }

  const usedBitOptions =
    props.funcParam.basicType === "bytes" ? bytesBitOptions : intBitOptions;

  const getCurrArraySizes = (): number[] => {
    const arraySizesMatch = props.funcParam.unitType.match(/\[(\d*)\]/g) || [];
    //console.log("hmm sies", arraySizesMatch);

    const sizes: number[] = [];
    for (let i = arraySizesMatch.length - 1; i >= 0; i--) {
      const size = arraySizesMatch[i];
      if (size === "[]") {
        sizes.push(0);
      } else {
        sizes.push(+size.replace("[", "").replace("]", ""));
      }
    }
    return sizes;
  };

  const currArraySizes = getCurrArraySizes();

  //console.log("curr arra sizes are", currArraySizes);

  const getSignature = (
    type: ParamTypes,
    bitAmount: number,
    basicType: string,
    arraySizes: number[],
  ) => {
    let sig = basicType; //.replace(/\[.*\]/, "").replace(/\d/g, "");
    //console.log("initial sig", sig);
    if (sig.indexOf("int") > -1 || sig === "bytes") {
      sig += bitAmount.toString();
    }
    if (
      type === ParamTypes.Array &&
      arraySizes != null &&
      arraySizes.length > 0
    ) {
      for (let i = arraySizes.length - 1; i >= 0; i--) {
        const size = arraySizes[i];
        if (size === 0) {
          sig += "[]";
        } else {
          sig += "[" + size + "]";
        }
      }
    }
    //console.log("generated sig", sig);
    return sig;
  };

  const changeBasicType = (val: string) => {
    let useBitAmount = defaultBitAmountInt;
    if (val === "bytes") {
      useBitAmount = defaultBitAmountBytes;
    }
    const sig = getSignature(paramType, useBitAmount, val, currArraySizes);
    props.setParamType(props.paramIndex, sig);
  };

  const changeBitAmount = (val: number) => {
    const sig = getSignature(
      paramType,
      val,
      props.funcParam.basicType,
      currArraySizes,
    );
    props.setParamType(props.paramIndex, sig);
  };

  const changeArrayType = (val: ParamTypes) => {
    if (val === ParamTypes.Basic) {
      const sig = getSignature(val, bitAmount, props.funcParam.basicType, null);
      props.setParamType(props.paramIndex, sig);
    } else if (val === ParamTypes.Array) {
      const sig = getSignature(val, bitAmount, props.funcParam.basicType, [0]);
      props.setParamType(props.paramIndex, sig);
    }
  };

  const changeArrayStaticSize = (dimIndex: number, valStr: string) => {
    const copy = [...currArraySizes];

    if (+valStr > 0) {
      copy[dimIndex] = +valStr;
    } else {
      copy[dimIndex] = 0;
    }
    const sig = getSignature(
      ParamTypes.Array,
      bitAmount,
      props.funcParam.basicType,
      copy,
    );
    props.setParamType(props.paramIndex, sig);
  };

  const signature = getSignature(
    paramType,
    bitAmount,
    props.funcParam.basicType,
    currArraySizes,
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
    if (paramType === ParamTypes.Basic) {
      props.setParamValue(props.paramIndex, newValue);
    } else {
      const copy = [...props.funcParam.value];
      copy[itemIndex] = newValue;
      //console.log("sending value", copy, newValue, itemIndex);
      props.setParamValue(props.paramIndex, copy);
    }
  };

  let values = props.funcParam.value;
  if (!Array.isArray(values)) {
    values = [values];
  }

  const onAddArrayDimension = () => {
    let copy = [...currArraySizes]; // `${props.funcParam.unitType}`;
    copy.push(0);

    const newSig = getSignature(
      paramType,
      bitAmount,
      props.funcParam.basicType,
      copy,
    );
    console.log("new sig", newSig);
    //copy += "[]";
    props.setParamType(props.paramIndex, newSig);
  };

  const onRemoveArrayDimension = (index: number) => {
    const copy = [...currArraySizes];
    copy.splice(index, 1);

    const sig = getSignature(
      ParamTypes.Array,
      bitAmount,
      props.funcParam.basicType,
      copy,
    );
    props.setParamType(props.paramIndex, sig);
  };

  const showBitOptions =
    props.funcParam.basicType.indexOf("int") > -1 ||
    props.funcParam.basicType === "bytes";
  const showArrayDimensions = paramType === ParamTypes.Array;
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
                checked={paramType === ParamTypes.Basic}
              />
              Basic
            </span>
            <span>
              <input
                type="radio"
                name="paramType"
                onChange={(e) => {
                  changeArrayType(ParamTypes.Array);
                }}
                checked={paramType === ParamTypes.Array}
              />
              Array
            </span>
          </div>
          {showArrayDimensions && (
            <>
              {currArraySizes.map((size, index) => {
                const radioName = "arrayType" + index;
                return (
                  <span key={index}>
                    <div>
                      <label>Dimension {index + 1} array:</label>
                      <span>
                        <input
                          type="radio"
                          name={radioName}
                          onChange={(e) => {
                            changeArrayStaticSize(index, "0");
                          }}
                          checked={size === 0}
                        />
                        Dynamic array
                      </span>
                      <span>
                        <input
                          type="radio"
                          name={radioName}
                          onChange={(e) => {
                            changeArrayStaticSize(index, "1");
                          }}
                          checked={size > 0}
                        />
                        Static array with&nbsp;
                        <input
                          type="text"
                          value={size}
                          placeholder={"num"}
                          onChange={(e) => {
                            changeArrayStaticSize(index, e.target.value);
                          }}
                          style={{ width: "50px" }}
                        ></input>
                        <label>items</label>
                      </span>

                      <Button
                        onClick={(e) => {
                          onRemoveArrayDimension(index);
                        }}
                        hidden={props.disableInput}
                      >
                        Remove dimension
                      </Button>
                    </div>
                  </span>
                );
              })}
              <div>
                <Button
                  onClick={onAddArrayDimension}
                  hidden={props.disableInput}
                >
                  Add dimension
                </Button>
              </div>
            </>
          )}
          {showBitOptions && (
            <div>
              <label>Number of bits:</label>
              <select
                onChange={(e) => {
                  changeBitAmount(+e.target.value);
                }}
                value={bitAmount}
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
          )}
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
                  {paramType !== ParamTypes.Basic && (
                    <Button
                      onClick={(e) => onRemoveValue(itemIndex)}
                      hidden={props.disableInput}
                    >
                      Remove value
                    </Button>
                  )}
                </span>
              );
            })}
          </div>
          {paramType !== ParamTypes.Basic && (
            <div>
              <Button onClick={onAddValue} hidden={props.disableInput}>
                Add value
              </Button>
            </div>
          )}
        </fieldset>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
