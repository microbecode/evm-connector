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
  addFunctions: (functions: IFuncTemplate[]) => void;
  addError: (error: string) => void;
}

export function ImportContract(props: Props) {
  const [abi, setABI] = useState<string>("");

  useEffect(() => {
    setABI("");
  }, [props.show]);

  const onABIImport = () => {
    const parseFunctions = (inputFuncs: FunctionFragment[]) => {
      const funcs: IFuncTemplate[] = [];

      inputFuncs.forEach((func) => {
        const inputs: IFunctionParam[] = [];
        func.inputs.forEach((put) => {
          if (UnitTypes.includes(put.type)) {
            const par = { unitType: put.type } as IFunctionParam;
            inputs.push(par);
          } else {
          }
        });
        const outputs: IFunctionParam[] = [];

        func.outputs.forEach((put) => {
          if (UnitTypes.includes(put.type)) {
            const par = { unitType: put.type } as IFunctionParam;
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

    try {
      const iface = new Interface(abi);
      console.log("got iface", iface);
      const functions = parseFunctions(Object.values(iface.functions));
      console.log("result", functions);
      if (functions?.length != Object.values(iface.functions)?.length) {
        props.addError(
          "Unable to parse all ABI functions. Added only the successful ones. (Required data types probably not implemented yet.)",
        );
      }
      props.addFunctions(functions);
      props.onHide();
    } catch (ex) {
      props.addError("Unable to parse ABI");
      props.onHide();
    }
  };

  const onStandardImport = (funcs: IFuncTemplate[]) => {
    props.addFunctions(funcs);
    props.onHide();
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
          Import contract functions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <fieldset>
            <legend>Import&nbsp;from&nbsp;ABI</legend>
            <div>(Not all ABI formats are supported)</div>
            <textarea
              placeholder="Paste ABI here"
              rows={5}
              onChange={(e) => {
                setABI(e.target?.value);
              }}
              value={abi}
            ></textarea>
            <input
              type="button"
              value="Import functions"
              onClick={onABIImport}
            ></input>
          </fieldset>
        </div>
        <fieldset>
          <legend>Import&nbsp;from&nbsp;standard</legend>
          <ContractTemplate
            addTemplateFunctions={onStandardImport}
          ></ContractTemplate>
        </fieldset>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
