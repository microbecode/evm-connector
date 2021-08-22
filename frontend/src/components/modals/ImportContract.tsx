import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { ethers } from "ethers";
import { FormatTypes, FunctionFragment, Interface } from "ethers/lib/utils";
import {
  FunctionParam,
  IFuncTemplate,
  StateMutability,
  UnitTypes,
} from "../types";

interface Props {
  show: boolean;
  onHide: () => void;
  addFunctions: (functions: IFuncTemplate[]) => void;
  addError: (error: string) => void;
}

export function ImportContract(props: Props) {
  const [abi, setABI] = useState<string>("");

  const onImport = () => {
    const parseFunctions = (inputFuncs: FunctionFragment[]) => {
      const funcs: IFuncTemplate[] = [];

      inputFuncs.forEach((func) => {
        const inputs: FunctionParam[] = [];
        func.inputs.forEach((put) => {
          if (UnitTypes.includes(put.type)) {
            const par = { unitType: put.type } as FunctionParam;
            inputs.push(par);
          } else {
          }
        });
        const outputs: FunctionParam[] = [];

        func.outputs.forEach((put) => {
          if (UnitTypes.includes(put.type)) {
            const par = { unitType: put.type } as FunctionParam;
            outputs.push(par);
          }
        });

        if (
          func.outputs?.length == outputs.length &&
          func.inputs?.length == inputs.length
        ) {
          // Only include functions where we managed to parse the inputs and outputs correctly
          const newFunc: IFuncTemplate = {
            funcName: func.name,
            funcType: func.stateMutability as StateMutability,
            funcInputParams: inputs,
            funcOutputParams: outputs,
          };
          funcs.push(newFunc);
        }
      });

      return funcs;
    };

    const iface = new Interface(abi);

    const functions = parseFunctions(Object.values(iface.functions));
    console.log("result", functions);

    if (functions?.length != Object.values(iface.functions)?.length) {
      props.addError(
        "Unable to parse all ABI functions. Added only the successful ones. (Required data types probably not implemented yet.)",
      );
    }

    props.addFunctions(functions);
    props.onHide();
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="modal-pp" centered>
      <Modal.Header closeButton>
        <Modal.Title id="modal-pp" className="text-uppercase">
          Import contract
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <fieldset>
            <legend>Import&nbsp;from&nbsp;ABI</legend>
            <textarea
              placeholder="Paste ABI here"
              rows={5}
              onChange={(e) => {
                setABI(e.target?.value);
              }}
              value={abi}
            ></textarea>
          </fieldset>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onImport}>Import</Button>
      </Modal.Footer>
    </Modal>
  );
}
