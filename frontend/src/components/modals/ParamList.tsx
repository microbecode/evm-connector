import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { IFunctionParam } from "../types";

interface Props {
  show: boolean;
  onHide: () => void;
  funcParam: IFunctionParam;
  paramIndex: number;
  disableInput: boolean;
  setParamValue: (index: number, value: any) => void;
  setParamArrayStaticity: (index: number, staticSize: number) => void;
}

export function ParamList(props: Props) {
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

    props.setParamValue(props.paramIndex, copy);
  };

  const changeArrayType = (val: boolean) => {
    if (val) {
      props.setParamArrayStaticity(props.paramIndex, 1); // default value is 1
    } else {
      props.setParamArrayStaticity(props.paramIndex, 0);
    }
  };

  const changeArrayStaticSize = (valStr: string) => {
    //console.log("changing", valStr, +valStr);
    if (Number.isInteger(+valStr)) {
      props.setParamArrayStaticity(props.paramIndex, +valStr);
    } else {
      props.setParamArrayStaticity(props.paramIndex, 0);
    }
  };

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
          Define array parameter values
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label>Value type: {props.funcParam.unitType}</label>
        </div>
        <div>
          {props.funcParam.value.map((item, itemIndex) => {
            return (
              <span key={itemIndex}>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => onChangeValue(e.target.value, itemIndex)}
                  disabled={props.disableInput}
                ></input>
                <Button
                  onClick={(e) => onRemoveValue(itemIndex)}
                  hidden={props.disableInput}
                >
                  Remove value
                </Button>
              </span>
            );
          })}
        </div>
        <div>
          <Button onClick={onAddValue} hidden={props.disableInput}>
            Add value
          </Button>
        </div>
        <div>
          <span>
            <label>Array type:</label>
            <input
              type="radio"
              name="arrayType"
              onChange={(e) => {
                changeArrayType(false);
              }}
              value={"0"}
              checked={!(props.funcParam.staticArraySize > 0)}
            />
            Dynamic
          </span>
          <span>
            <input
              type="radio"
              name="arrayType"
              onChange={(e) => {
                changeArrayType(true);
              }}
              value={"1"}
              checked={props.funcParam.staticArraySize > 0}
            />
            Static with&nbsp;
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
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
