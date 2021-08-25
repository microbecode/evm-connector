import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import { FormatTypes, FunctionFragment, Interface } from "ethers/lib/utils";
import {
  IFunctionParam,
  IFuncTemplate,
  StateMutability,
  UnitTypes,
} from "../types";
import { ContractTemplate } from "../contract/ContractTemplate";

interface Props {
  show: boolean;
  onHide: () => void;
  funcParam: IFunctionParam;
  paramIndex: number;
  disableInput: boolean;
  setParamValue: (index: number, value: any) => void;
  setParamArrayStaticity: (index: number, isStatic: boolean) => void;
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
    props.setParamArrayStaticity(props.paramIndex, val);
  };

  const modalProps = { onHide: props.onHide, show: props.show };

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
              checked={
                props.funcParam.isStaticArray == false ||
                props.funcParam.isStaticArray == undefined
              }
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
              checked={props.funcParam.isStaticArray === true}
            />
            Static
          </span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
