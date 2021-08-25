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
  setParamValue: (index: number, value: any) => void;
}

export function ParamList(props: Props) {
  // const [funcValue, setFuncValue] = useState<any[]>([]);

  /*   useEffect(() => {
    setFuncValue(props.funcParam.value);
  }, [props.funcParam]); */

  console.log("got value", props.funcParam);
  if (props.funcParam && Array.isArray(props.funcParam.value)) {
    console.log(props.funcParam.value[1]);
  }

  const modalProps = { onHide: props.onHide, show: props.show };

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

  return (
    <Modal {...modalProps} size="lg" aria-labelledby="modal-pp" centered>
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
              <>
                <input
                  key={itemIndex}
                  type="text"
                  value={item}
                  onChange={(e) => onChangeValue(e.target.value, itemIndex)}
                ></input>
                <Button onClick={(e) => onRemoveValue(itemIndex)}>
                  Remove value
                </Button>
              </>
            );
          })}
        </div>
        <div>
          <Button onClick={onAddValue}>Add value</Button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
